import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductItem from './ProductItem';

import './Home.css';

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
			dispatch({ type: 'FETCH_FAIL', payload: err.message });
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<div>
			<h2>Featured products</h2>
			<div className="products">
				{loading ? (
					<div>'Loading...'</div>
				) : error ? (
					<div>{error}</div>
				) : (
					<Row>
						{products.map((product) => (
							<Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
								<ProductItem product={product} />
							</Col>
						))}
					</Row>
				)}
			</div>
		</div>
	);
}
