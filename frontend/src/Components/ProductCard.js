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

	const addToCartHandler = async () => {
		const productExist = state.cart.cartItems.find(
			(item) => item._id === product._id
		);
		const quantity = productExist ? productExist.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${product._id}`);
		if (data.countInStock < quantity) {
			window.alert('Sorry, product is out of stock.');
			return;
		}

		ctxDispatch({
			type: 'Add_To_Cart',
			payload: { ...product, quantity },
		});
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
				<Button onClick={addToCartHandler}>Add to cart</Button>
			</Card.Body>
		</Card>
	);
}
