import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import Rating from './Rating';

export default function ProductItem(props) {
	const { product } = props;
	return (
		<Card key={product.slug}>
			<Link to={`/product/${product.slug}`}>
				<img src={product.image} className="card-img-top" alt={product.name} />
			</Link>
			<Card.Body>
				<Link to={`/product/${product.slug}`}>
					<Card.Title>{product.name}</Card.Title>
				</Link>
				<Rating
					rating={product.rating}
					numReviews={product.numReviews}
				></Rating>
				<Card.Text>${product.price}</Card.Text>
				<Button>Add to cart</Button>
			</Card.Body>
		</Card>
	);
}
