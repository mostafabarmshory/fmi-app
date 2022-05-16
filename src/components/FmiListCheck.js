import React, { Component } from 'react';
import moneyJackpot from '../assets/sounds/MoneyJackpot-PS03_67_preview.mp3';
import { CSVLink } from "react-csv";
import FmiListStatisticsPie from "./FmiListStatisticsPie";
import FmiResultTable from "./FmiResultTable"
import {
	Container,
	Row,
	Col,
	ProgressBar
} from "react-bootstrap";
import PromisePool from 'es6-promise-pool';

let song = new Audio(moneyJackpot);


function fetchFMI(imei) {
	try {
		return fetch('/api/v1/fmicheck?imei=' + imei, {
			headers: {
				'Cache-Control': 'no-cache'
			}
		}).then(response => {
			if (!response.ok) {
				return 'fail';
			}
			return response.text();
		});
	} catch (e) {
		return Promise.resolve('fail');
	}
}

class FmiListCheck extends Component {


	/**
	Crates new instance of the class
	 */
	constructor(props) {
		super(props);
		this.state = {
			processing: false,
			progress: 0,
			items: [],
			inputValue: '',
			inputChanged: false,
			cancelRequest: false,
			statistics: {
				off: 0,
				clean: 0,
				lost: 0,
				unkown: 0,
			}
		};
		this.items = [];
	}

	generateNewItemsFromString(text) {
		var imeis = text.split(/[,.\s]/).filter(Boolean);
		const max = imeis.length
		this.items = [];
		for (var index = 0; index < max; index++) {
			this.items.push({
				index: index,
				state: 'wait',
				imei: imeis[index],
				hidden: false
			});
		}
		this.setState({
			items: this.items,
			max: max,
			inputChanged: false
		});
	}

	startProcessing() {
		// check inputs
		const inputValue = this.state.inputValue;
		if (!inputValue) {
			this.showError('Fill the input field');
			return;
		}
		this.generateNewItemsFromString(inputValue);
		this.filterItems(this.state.filterText);
		this.run()
	}

	resumeProcessing() {
		this.filterItems(this.state.filterText);
		this.run();
	}

	run() {
		this.setState({
			processing: true,
		});

		var concurrency = 3;
		var index = 0;
		var pool = new PromisePool(() => {
			// run processes
			if (index >= this.items.length || this.state.cancelRequest) {
				return null;
			}
			var item = this.items[index++];
			return this.recheckItem(item).then(() => this.setState({
				'items': this.items
			}));
		}, concurrency);
		this.poolPromise = pool.start().then(() => {
			this.setState({
				processing: false,
				cancelRequest: false,
				resetRequest: false,
			});
		});
	}

	stopProcessing(event) {
		this.setState({
			cancelRequest: true,
		});
	}

	resetProcess(event) {
		if (this.state.processing) {
			alert('Process is running!!!');
			return;
		}
		// TODO: maso, 2020: check if process is running
		this.items = [];
		this.setState({
			items: this.items,
			inputValue: '',
		});
	}

	updateInputValue(event) {
		const val = event.target.value;
		this.setState({
			inputValue: val,
			inputChanged: true
		});
	}

	showError(message) {
		alert(message);
	}

	recheckItem(item) {
		if (['clean', 'off', 'lost'].includes((item.state||"").toLowerCase())) {
			return Promise.resolve();
		}
		// Set Item working
		var ritem = this.items[item.index];
		ritem.state = 'working';
		this.setState({
			items: this.items
		});
		// update item
		return fetchFMI(item.imei).then((str) => {
			ritem.state = '' + str;
			this.playSoundForItem(item);
			var value = this.makeStatistics();
			this.setState({
				items: this.items,
				statistics: value,
				progress: Math.round((this.items.length - value.unkown) * 100 / this.items.length)
			});
		});
	}

	playSoundForItem(item) {
		switch (item.state) {
			case 'OFF':
				song.pause();
				song.currentTime = 0
				song.play();
				break;
			case 'LOST':
			case 'CLEAN':
			default:
		}
	}

	makeStatistics() {
		var value = {
			off: 0,
			lost: 0,
			clean: 0,
			unkown: 0
		};
		this.items.forEach((item) => {
			switch (item.state) {
				case 'OFF':
					value.off++;
					break;
				case 'LOST':
					value.lost++;
					break;
				case 'CLEAN':
					value.clean++;
					break;
				default:
					value.unkown++;
					break;
			}
		});
		return value;
	}

	filterItems(text) {
		this.items.forEach((item) => {
			item.hidden = !!text && !(item.imei.indexOf(text) >= 0 || item.state.toLowerCase().indexOf(text.toLowerCase()) >= 0);
		});
		this.setState({
			'items': this.items
		});
	}

	/**
	  enders the component
	  */
	render() {
		var headers = [
			{ label: "Index", key: "index" },
			{ label: "IMEI", key: "imei" },
			{ label: "State", key: "State" }
		];
		return <Container fluid className={this.props.className}>
			<Row className="align-middle">
				<h1>FMI checker by Dr.Moe</h1>
			</Row>
			<Row>
				<label
					for="fmilist"
					class="form-label">FMI List</label>
				<textarea
					style={{
						'max-width': '700px'
					}}
					rows="6"
					type="text"
					class="form-control"
					id="fmilist"
					aria-describedby="fmiHelp"
					disabled={this.state.processing}
					onChange={event => this.updateInputValue(event)}
					value={this.state.inputValue}></textarea>
				<div
					id="fmiHelp"
					class="form-text">Use each line for a FMI.</div>
			</Row>
			<Row>
				<div>
					<button
						style={{
							'margin': '8px'
						}}
						class={`btn btn-primary float-start ${this.state.processing || this.state.inputChanged || !this.state.inputValue ? 'd-none' : ''}`}
						type="button"
						onClick={(event) => this.resumeProcessing(event)}>Resume</button>
					<button
						style={{
							'margin': '8px'
						}}
						class={`btn btn-primary float-start ${this.state.processing ? 'd-none' : ''}`}
						type="button"
						onClick={(event) => this.startProcessing(event)}>Submit</button>
					<button
						style={{
							'margin': '8px'
						}}
						class={`btn btn-primary float-start ${this.state.processing ? 'd-none' : ''}`}
						type="button"
						onClick={(event) => this.resetProcess(event)}>Reset</button>
					<button
						style={{
							'margin': '8px'
						}}
						class={`btn btn-primary float-start ${!this.state.processing ? 'd-none' : ''}`}
						type="button"
						onClick={(event) => this.stopProcessing(event)}>Stop</button>
				</div>
			</Row>
			<Row>
				<Row
					className={`${!this.state.processing ? 'd-none' : ''}`}>
					<ProgressBar
						now={this.state.progress}
						label={`${this.state.progress}%`}
						variant="success"></ProgressBar>
				</Row>
				<Row
					className={`${!this.state.items.length ? 'd-none' : ''}`}
					id="tableActions">
					<Col>
						<p>
							<span>{this.state.max - this.state.statistics.unkown} of {this.state.max}</span><br />
							<small class={`${!this.state.processing ? 'd-none' : ''}`}>
								Progress: {this.state.progress}%
							</small>
							<small class={`${this.state.processing ? 'd-none' : ''}`}>
								Completed!
							</small>
						</p>
					</Col>
					<Col xs={2}>
						<CSVLink
							data={this.state.items}
							headers={headers}>Download CSV</CSVLink>
					</Col>
				</Row>
				<Row>
					<FmiResultTable
						data={this.state.items}
						className="col-12 col-md-8"
						id="resultTable"
						onRecheckItem={(item) => this.recheckItem(item)}
						onFilterChange={(filterText) => this.filterItems(filterText)}
						style={{
							maxHeight: '500px',
							overflow: 'auto'
						}}></FmiResultTable>
					<FmiListStatisticsPie
						data={this.state.statistics}
						className={`col-12 col-md-4 ${(!this.state.items.length ? ' d-none' : '')}`}>
					</FmiListStatisticsPie>
				</Row>
				<Row
					className={`${!this.state.items.length ? 'd-none' : ''}`}
					id="tableActions">
					<Col>
						<p>
							<span>{this.state.max - this.state.statistics.unkown} of {this.state.max}</span><br />
							<small class={`${!this.state.processing ? 'd-none' : ''}`}>
								Progress: {this.state.progress}%
							</small>
							<small class={`${this.state.processing ? 'd-none' : ''}`}>
								Completed!
							</small>
						</p>
					</Col>
					<Col xs={2}>
						<CSVLink
							data={this.state.items}
							headers={headers}>Download CSV</CSVLink>
					</Col>
				</Row>
			</Row>
		</Container>;
	}
}

export default FmiListCheck;