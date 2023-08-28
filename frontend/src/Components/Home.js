import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
	const [products, setProducts] = useState([]);
	const [reload, setReload] = useState(false);

	const fetchProducts = async () => {
		setReload(true);
		const result = await axios.get('/api/products');
		setProducts(result.data);
		setReload(false);
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<div>
			<h1>Featured products</h1>
			<div className="products">
				{reload && 'Reloading...'}
				{products.map((product) => (
					<div className="product" key={product.slug}>
						<Link to={`/product/${product.slug}`}>
							<img src={product.image} alt={product.name} />
						</Link>
						<div className="product-info">
							<Link to={`/product/${product.slug}`}>
								<p>{product.name}</p>
							</Link>
							<p>
								<strong>${product.price}</strong>
							</p>
							<button>Add to cart</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
