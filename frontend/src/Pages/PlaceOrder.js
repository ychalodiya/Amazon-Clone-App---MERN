import React, { useContext, useEffect, useReducer } from 'react';
import CheckoutSteps from '../Components/CheckoutSteps';
import LoadingBox from '../Components/LoadingBox';
import { Helmet } from 'react-helmet-async';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Store } from '../Components/Store';
import { Link, useNavigate } from 'react-router-dom';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import axios from 'axios';

const reducer = (state, action) => {
	switch (action.type) {
		case 'CREATE_REQUEST':
			return { ...state, loading: true };
		case 'CREATE_SUCCESS':
			return { ...state, loading: false };
		case 'CREATE_FAIL':
			return { ...state, loading: false };
		default:
			return { ...state };
	}
};

export default function PlaceOrder() {
	const navigate = useNavigate();
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { cart, userInfo } = state;
	const [{ loading }, dispatch] = useReducer(reducer, {
		loading: false,
	});

	const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

	cart.itemPrice = round2(
		cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
	);

	cart.shippingPrice = cart.itemPrice > 100 ? round2(0) : round2(10);

	cart.taxPrice = round2(0.13 * cart.itemPrice);

	cart.totalPrice = cart.itemPrice + cart.shippingPrice + cart.taxPrice;

	const placeOrderhandler = async () => {
		try {
			dispatch({ type: 'CREATE_REQUEST' });
			console.log(cart.cartItems);
			const { data } = await axios.post(
				'/api/orders',
				{
					orderItems: cart.cartItems,
					shippingAddress: cart.shippingAddress,
					paymentMethod: cart.paymentMethod,
					itemPrice: cart.itemPrice,
					shippingPrice: cart.shippingPrice,
					taxPrice: cart.taxPrice,
					totalPrice: cart.totalPrice,
				},
				{
					headers: {
						authorization: `Bearer ${userInfo.token}`,
					},
				}
			);
			ctxDispatch({ type: 'CART_CLEAR' });
			dispatch({ type: 'CREATE_SUCCESS' });
			localStorage.removeItem('cartItems');
			navigate(`/order/${data.order._id}`);
		} catch (error) {
			dispatch({ type: 'CREATE_FAIL' });
			toast.error(getError(error));
		}
	};

	useEffect(() => {
		if (!cart.paymentMethod) {
			navigate('/payment');
		}
	}, [cart, navigate]);

	return (
		<div>
			<Helmet>
				<title>Preview Order Information</title>
			</Helmet>
			<CheckoutSteps step1 step2 step3 step4 />
			<h1 className="my-3">Preview Order</h1>
			<Row>
				<Col md={8}>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Shipping</Card.Title>
							<Card.Text>
								<strong>Name: </strong> {cart.shippingAddress.fullName} <br />
								<strong>Address: </strong> {cart.shippingAddress.address},{' '}
								{cart.shippingAddress.city}, {cart.shippingAddress.postalCode},{' '}
								{cart.shippingAddress.country}
							</Card.Text>
							<Link to="/shipping">Edit</Link>
						</Card.Body>
					</Card>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Items</Card.Title>
							<ListGroup variant="flush">
								{cart.cartItems.map((item) => (
									<ListGroup.Item key={item._id}>
										<Row className="align-items-center">
											<Col md={6}>
												<img
													src={item.image}
													alt={item.name}
													className="img-fluid rounded  img-thumbnail"
												/>{' '}
												<Link to={`/product/${item.slug}`}>{item.name}</Link>
											</Col>
											<Col md={3}>{item.quantity}</Col>
											<Col md={3}>${item.price}</Col>
										</Row>
									</ListGroup.Item>
								))}
							</ListGroup>
							<div className="text-center">
								<Link to="/cart" className="align-items-center">
									Edit
								</Link>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card>
						<Card.Body>
							<Card.Title>Order Summary</Card.Title>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<Row>
										<Col>Items</Col>
										<Col>
											{': '}${cart.itemPrice.toFixed(2)}
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Shipping</Col>
										<Col>
											{': '}${cart.shippingPrice.toFixed(2)}
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Tax (13%)</Col>
										<Col>
											{': '}${cart.taxPrice.toFixed(2)}
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Order Total</Col>
										<Col>
											{': '}${cart.totalPrice.toFixed(2)}
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<div className="d-grid">
										<Button
											type="button"
											disabled={cart.cartItems.length === 0}
											onClick={placeOrderhandler}
										>
											Place Order
										</Button>
									</div>
									{loading && <LoadingBox />}
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
