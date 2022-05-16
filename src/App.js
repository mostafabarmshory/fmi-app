import FmiListCheck from './components/FmiListCheck';
import logo from './logo.svg';
import './App.css';
import { 
	Container,
	Row,
	Col
} from "react-bootstrap";

function App() {
	return (
		<Container
			fluid>
			<Row
				className="ms-5">
				<img
					height="32px"
					src={logo}
					className="App-logo col-1"
					alt="logo"
					style={{
						'margin': '0px',
						'padding': '0px',
					}} />
				<Col className="align-middle m-0"><p>A fast FMI checker</p></Col>
			</Row>
			<FmiListCheck></FmiListCheck>
		</Container>
	);
}

export default App;
