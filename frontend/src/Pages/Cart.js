import React, { useContext } from 'react';
import { Store } from '../Components/Store';
import { Helmet } from 'react-helmet-async';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import MessageBox from '../Components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Cart() {
	const navigate = useNavigate();
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		cart: { cartItems },
	} = state;

	const updateCartHandler = async (product, quantity) => {
		const { data } = await axios.get(`/api/products/${product._id}`);
		if (data.countInStock < quantity) {
			window.alert('Sorry, product is out of stock.');
			return;
		}
		ctxDispatch({ type: 'Add_To_Cart', payload: { ...product, quantity } });
	};

	const removeProductHandler = (product) => {
		ctxDispatch({ type: 'REMOVE_FROM_CART', payload: product });
	};

	const checkoutHandler = () => {
		navigate('/signin?redirect=/shipping');
	};

	return (
		<div>
			<Helmet>
				<title>Shopping Cart</title>
			</Helmet>
			<h1>Shopping Cart</h1>
			<Row>
				<Col md={8}>
					{cartItems.length <= 0 ? (
						<MessageBox>
							Cart is empty. <Link to="/">Go to Shopping</Link>
						</MessageBox>
					) : (
						<ListGroup>
							{cartItems.map((item) => (
								<ListGroup.Item key={item._id}>
									<Row className="align-items-center">
										<Col md={4}>
											<img
												src={item.image}
												className="img-fluid rounded img-thumbnail"
												alt={item.name}
											/>{' '}
											<Link
												to={`/api/products/slug/${item.slug}`}
												className="navigation-link"
											>
												{item.name}
											</Link>
										</Col>
										<Col md={3}>
											<Button
												variant="light"
												disabled={item.quantity === 1}
												onClick={updateCartHandler.bind(
													this,
													item,
													item.quantity - 1
												)}
											>
												{' '}
												<i className="fas fa-minus-circle" />
											</Button>{' '}
											<span>{item.quantity}</span>{' '}
											<Button
												variant="light"
												disabled={item.quantity === item.countInStock}
												onClick={updateCartHandler.bind(
													this,
													item,
													item.quantity + 1
												)}
											>
												{' '}
												<i className="fas fa-plus-circle" />
											</Button>
										</Col>
										<Col md={3}>
											<p className="align-items-center mt-3">
												$ {item.quantity * item.price}
											</p>
										</Col>
										<Col md={2}>
											<Button
												variant="light"
												onClick={removeProductHandler.bind(this, item)}
											>
												<i className="fas fa-trash" />
											</Button>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</Col>
				<Col md={4}>
					<Card>
						<Card.Body variant="flush">
							<ListGroup>
								<ListGroup.Item>
									<h5>
										Total items:{' '}
										{cartItems.reduce(
											(acc, current) => acc + current.quantity,
											0
										)}
									</h5>
								</ListGroup.Item>
								<ListGroup.Item>
									<h5>
										Total amount: $
										{cartItems.reduce(
											(acc, current) => acc + current.quantity * current.price,
											0
										)}
									</h5>
								</ListGroup.Item>
								<ListGroup.Item>
									<div className="d-grid">
										<Button
											variant="primary"
											className="checkout-button"
											disabled={cartItems.length === 0}
											onClick={checkoutHandler}
										>
											Proceed to Checkout
										</Button>
									</div>
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
