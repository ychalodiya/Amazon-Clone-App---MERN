import express from 'express';
import data from './data.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/api/products', (req, res) => {
	res.send(data.products);
});

app.get('/api/products/slug/:slug', (req, res) => {
	const product = data.products.find((item) => item.slug === req.params.slug);
	if (product) {
		res.send(product);
	} else {
		res.status(404).send({ message: 'Product is not available.' });
	}
});

app.listen(PORT, () => {
	console.log('Server is listening at ' + PORT);
});
