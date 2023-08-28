import express from 'express';
import data from './data.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/api/products', (req, res) => {
	res.send(data.products);
});

app.listen(PORT, () => {
	console.log('Server is listening at ' + PORT);
});
