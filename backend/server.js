import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
dotenv.config();

const app = express();
const PORT = 4000;

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('Connected to MongoDB database');
	})
	.catch((err) => {
		console.log(err.message);
	});

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);

app.listen(PORT, () => {
	console.log('Server is listening at ' + PORT);
});
