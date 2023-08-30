import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import Rating from './Rating';
import { Store } from './Store';
import axios from 'axios';

export default function ProductItem(props) {
	const { product } = props;
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		cart: { cartItems },
	} = state;

	const addToCartHandler = async (product) => {
		const productExist = state.cart.cartItems.find(
			(item) => item._id === product._id
		);
		const quantity = productExist ? productExist.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${product._id}`);
		if (data.countInStock < quantity) {
			window.alert('Sorry, product is out of stock.');
			return;
		}
		ctxDispatch({ type: 'Add_To_Cart', payload: { ...product, quantity } });
	};

	return (
		<Card key={product.slug}>
			<Link to={`/api/products/slug/${product.slug}`}>
				<img src={product.image} className="card-img-top" alt={product.name} />
			</Link>
			<Card.Body>
				<Link to={`/api/products/slug/${product.slug}`}>
					<Card.Title>{product.name}</Card.Title>
				</Link>
				<Rating rating={product.rating} numReviews={product.numReviews} />
				<Card.Text>${product.price}</Card.Text>
				{product.countInStock === 0 ? (
					<Button variant="light" disabled>
						Out of Stock
					</Button>
				) : (
					<Button onClick={addToCartHandler.bind(this, product)}>
						Add to cart
					</Button>
				)}
			</Card.Body>
		</Card>
	);
}
