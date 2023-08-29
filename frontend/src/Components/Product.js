import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Rating from './Rating';
import LoadingBox from './LoadingBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Card, ListGroup } from 'react-bootstrap';
import MessageBox from './MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, product: action.payload, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

export default function Product() {
	const params = useParams();
	const { slug } = params;
	const [{ loading, error, product }, dispatch] = useReducer(reducer, {
		loading: true,
		error: '',
		product: [],
	});

	const fetchProducts = async () => {
		dispatch({ type: 'FETCH_REQUEST' });
		try {
			const result = await axios.get(`/api/products/slug/${slug}`);
			dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
		} catch (err) {
			const message = getError(err);
			dispatch({
				type: 'FETCH_FAIL',
				payload: message,
			});
		}
	};

	useEffect(() => {
		fetchProducts();
	}, [slug]);

	return (
		<div>
			{loading ? (
				<LoadingBox />
			) : error ? (
				<>
					<Helmet>
						<title> {error} </title>
					</Helmet>
					<MessageBox variant="danger">{error}</MessageBox>
				</>
			) : (
				<div className="mt-3">
					<Row>
						<Col md={6}>
							<img
								className="img-large"
								src={product.image}
								alt={product.name}
							/>
						</Col>
						<Col md={3}>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<Helmet>
										<title>{product.name}</title>
									</Helmet>
									<h2>{product.name}</h2>
								</ListGroup.Item>
								<ListGroup.Item>
									<Rating
										rating={product.rating}
										numReviews={product.numReviews}
									/>
								</ListGroup.Item>
								<ListGroup.Item>
									<h3>${product.price}</h3>
								</ListGroup.Item>
								<ListGroup.Item>
									<p>Description: {product.description}</p>
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={3}>
							<Card>
								<Card.Body>
									<ListGroup variant="flush">
										<ListGroup.Item>
											<Row>
												<Col>Price: </Col>
												<Col>${product.price}</Col>
											</Row>
											<Row>
												<Col>Status: </Col>
												<Col>
													{product.countInStock > 0 ? (
														<span class="badge bg-success">Available</span>
													) : (
														<span class="badge bg-danger">Out of stock</span>
													)}
												</Col>
											</Row>
										</ListGroup.Item>
										{product.countInStock > 0 && (
											<ListGroup.Item>
												<div className="d-grid">
													<Button variant="primary">Add to Cart</Button>
												</div>
											</ListGroup.Item>
										)}
									</ListGroup>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</div>
			)}
		</div>
	);
}
