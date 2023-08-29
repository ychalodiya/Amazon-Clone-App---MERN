import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import ProductList from './Components/ProductList';
import Product from './Components/Product';
import { Navbar, Container, Nav, Badge, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Components/Store';

function App() {
	const { state } = useContext(Store);
	return (
		<BrowserRouter>
			<div className="d-flex flex-column site-container">
				<header>
					<Navbar bg="dark" variant="dark">
						<Container>
							<LinkContainer to="/">
								<Navbar.Brand>Amazon Marketplace</Navbar.Brand>
							</LinkContainer>
							<Card className="bg-dark" border="secondary">
								<Card.Body>
									<Nav className="ms-auto">
										<Link to="/cart" className="nav-link">
											Cart{` `}
											{state.cart.cartItems.length > 0 && (
												<Badge pill bg="danger">
													{state.cart.cartItems.reduce(
														(accumulator, currentItem) =>
															accumulator + currentItem.quantity,
														0
													)}
												</Badge>
											)}
										</Link>
									</Nav>
								</Card.Body>
							</Card>
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
