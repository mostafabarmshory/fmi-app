import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
	Container,
	Row,
	Col
} from "react-bootstrap"

ChartJS.register(ArcElement, Tooltip, Legend);
export default class FmiListStatisticsPie extends Component {

	/**
	Crates new instance of the class
	 */
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	/**
	Renders the component
	 */
	render() {
		var data = {
			labels: ['LOST', 'CLEAN', 'OFF', 'INVALID', 'UNKNOWN'],
			datasets: [
				{
					data: [
						this.props.data.lost,
						this.props.data.clean,
						this.props.data.off,
						this.props.data.invalid,
						this.props.data.unkown
					],
					backgroundColor: [
						'rgba(255, 0, 0, 0.2)',
						'rgba(0, 255, 0, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(255, 256, 0, 0.2)',
						'rgba(255, 255, 255, 0.2)',
					],
					borderColor: [
						'rgba(255, 0, 0, 1)',
						'rgba(0, 255, 0, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(255, 256, 0, 1)',
						'rgba(255, 255, 255, 1)',
					],
					borderWidth: 1,
				},
			],
		};
		
		return <div className={this.props.className}>
			<Container fluid>
				<Row>
					<Col xs="12">
						<Pie
							data={data}></Pie>
					</Col>
					<Col xs="12">
						<table>
							<tr>
								<td>LOST</td>
								<td>: {this.props.data.lost}</td>
							</tr>
							<tr>
								<td>CLEAN</td>
								<td>: {this.props.data.clean}</td>
							</tr>
							<tr>
								<td>OFF</td>
								<td>: {this.props.data.off}</td>
							</tr>
							<tr>
								<td>INVALID</td>
								<td>: {this.props.data.invalid}</td>
							</tr>
							<tr>
								<td>UNKNOWN</td>
								<td>: {this.props.data.unkown}</td>
							</tr>
							<hr />
							<tr>
								<td>Total</td>
								<td>: {this.props.data.lost +
									this.props.data.clean +
									this.props.data.off +
									this.props.data.invalid +
									this.props.data.unkown}</td>
							</tr>
						</table>
					</Col>
				</Row>
			</Container>
		</div>;
	}
}

