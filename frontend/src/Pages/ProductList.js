import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from '../Components/ProductCard';

import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Components/LoadingBox';
import MessageBox from '../Components/MessageBox';
import { getError } from '../utils';
import './ProductList.css';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, products: action.payload, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

export default function Home() {
	const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
		loading: true,
		error: '',
		products: [],
	});

	const fetchProducts = async () => {
		dispatch({ type: 'FETCH_REQUEST' });
		try {
			const result = await axios.get('/api/products');
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
	}, []);

	return (
		<div>
			<Helmet>
				<title>Amazon Marketplace</title>
			</Helmet>
			<h2>Featured products</h2>
			<div className="products">
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
					<Row>
						{products.map((product) => (
							<Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
								<ProductCard product={product} />
							</Col>
						))}
					</Row>
				)}
			</div>
		</div>
	);
}
