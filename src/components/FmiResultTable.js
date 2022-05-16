import React, { Component } from 'react';
import {
	Button,
	Container,
	Row,
	Col
} from "react-bootstrap";

function toColor(str) {
	switch (str) {
		case 'LOST':
			return 'red';
		case 'CLEAN':
			return 'green';
		case 'OFF':
			return 'orange';
		default:
			return '#FFFFFF';
	}
}

export default class FmiResultTable extends Component {

	/**
	Crates new instance of the class
	 */
	constructor(props) {
		super(props);
		this.state = {
			filterText: ''
		};
	}
	
	updateFilterText(text){
		if(this.props.onFilterChange){
			this.props.onFilterChange(text);
		}
		this.setState({
			filterText: text
		});
	}

	/**
	Renders the component
	 */
	render() {
		return <div 
			id={this.props.id || ""}
			style={{...this.props.style}}
			className={this.props.className + (!this.props.data.length ? ' d-none' : '')}>
			<Container fluid>
				<Row>
					<Col>
						<input
							placeholder='Filter'
							value={this.state.fitlerText}
							onChange={(event) => this.updateFilterText(event.target.value)}></input>
					</Col>
				</Row>
				<Row>
					<table
						id="dataTable"
						className="table table-striped">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">IMEI</th>
								<th scope="col">State</th>
								<th scope="col">Actions</th>
							</tr>
						</thead>
						<tbody>
							{this.props.data.map(item => {
								return <tr class={item.hidden ? 'd-none':''}>
									<th
										style={{
											color: toColor(item.state)
										}}
										scope="row">{item.index}</th>
									<th
										style={{
											color: toColor(item.state)
										}}
										scope="row">{item.imei}</th>
									<th
										style={{
											color: toColor(item.state)
										}}
										class={`${item.state === 'working' ? '':'d-none'}`}
										scope="row">
										<div class="spinner-border text-primary" role="status">
											<span class="visually-hidden">Loading...</span>
										</div>
									</th>
									<th
										style={{
											color: toColor(item.state)
										}}
										class={`${item.state !== 'working' ? '': 'd-none'}`}
										scope="row">{item.state}</th>
									<th>
										<Button 
											disabled={['clean', 'off', 'lost', 'working', 'wait'].includes((item.state||"").toLowerCase())}
											variant="primary"
											onClick={(event) => {this.props.onRecheckItem(item)}}>Recheck</Button>
									</th>
								</tr>;
							})}
						</tbody>
					</table>
				</Row>
			</Container>
		</div>;
	}
}