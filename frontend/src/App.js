import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Product from './Components/Product';
import { Navbar, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function App() {
	return (
		<BrowserRouter>
			<div className="d-flex flex-column site-container">
				<header>
					<Navbar bg="dark" variant="dark">
						<Container>
							<LinkContainer to="/">
								<Navbar.Brand>Amazon Marketplace</Navbar.Brand>
							</LinkContainer>
						</Container>
					</Navbar>
				</header>
				<main>
					<Container>
						<Routes>
							<Route path="/product/:slug" element={<Product />} />
							<Route path="/" element={<Home />} />
						</Routes>
					</Container>
				</main>
				<footer>
					<div className="text-center">All rights reserved.</div>
				</footer>
			</div>
		</BrowserRouter>
	);
}

export default App;
