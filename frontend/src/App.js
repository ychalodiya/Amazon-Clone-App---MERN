import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ProductList from './Components/ProductList';
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
							<Route path="/api/products/slug/:slug" element={<Product />} />
							<Route path="/" element={<ProductList />} />
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
