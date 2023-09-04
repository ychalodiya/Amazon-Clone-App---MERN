import { useContext } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar, Container, Nav, Badge, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from './Components/Store';
import Product from './Pages/Product';
import ProductList from './Pages/ProductList';
import Cart from './Pages/Cart';
import Signin from './Pages/Signin';
import './App.css';
import Shipping from './Pages/Shipping';
import Signup from './Pages/Signup';
import Payment from './Pages/Payment';
import PlaceOrder from './Pages/PlaceOrder';

function App() {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { cart, userInfo } = state;
	const signoutHandler = () => {
		ctxDispatch({ type: 'USER_SIGNOUT' });
	};

	return (
		<BrowserRouter>
			<div className="d-flex flex-column site-container">
				<ToastContainer position="bottom-center" limit={1} />
				<header>
					<Navbar bg="dark" variant="dark">
						<Container>
							<LinkContainer to="/">
								<Navbar.Brand>Amazon Marketplace</Navbar.Brand>
							</LinkContainer>

							<Nav className="ms-auto">
								<Link to="/cart" className="nav-link">
									Cart{` `}
									{cart.cartItems.length > 0 && (
										<Badge pill bg="danger">
											{cart.cartItems.reduce(
												(accumulator, currentItem) =>
													accumulator + currentItem.quantity,
												0
											)}
										</Badge>
									)}
								</Link>
								{userInfo ? (
									<NavDropdown title={userInfo.name} id="basic-nav-dropdown">
										<LinkContainer to="/profile">
											<NavDropdown.Item>User Profile</NavDropdown.Item>
										</LinkContainer>
										<LinkContainer to="/orderhistory">
											<NavDropdown.Item>Order History</NavDropdown.Item>
										</LinkContainer>
										<NavDropdown.Divider />
										<Link
											to="/signout"
											className="dropdown-item"
											onClick={signoutHandler}
										>
											Sign Out
										</Link>
									</NavDropdown>
								) : (
									<Link to="/signin" className="nav-link">
										Sign In
									</Link>
								)}
							</Nav>
						</Container>
					</Navbar>
				</header>
				<main>
					<Container>
						<Routes>
							<Route path="/api/products/slug/:slug" element={<Product />} />
							<Route path="/cart" element={<Cart />} />
							<Route path="/signin" element={<Signin />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/shipping" element={<Shipping />} />
							<Route path="/payment" element={<Payment />} />
							<Route path="/placeOrder" element={<PlaceOrder />} />
							<Route path="/" element={<ProductList />} />
						</Routes>
					</Container>
				</main>
				<footer>
					<div className="text-center">
						{new Date().getFullYear()} All rights reserved.
					</div>
				</footer>
			</div>
		</BrowserRouter>
	);
}

export default App;
