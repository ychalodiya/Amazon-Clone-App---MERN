import express from 'express';
import mongoose from 'mongoose';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import dotenv from 'dotenv';
import orderRouter from './routes/orderRoutes.js';
import { isAuth } from './utils.js';
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/keys/paypal', isAuth, (req, res) => {
	res.send(process.env.PAYPAL_CLIENT_ID || 'SB');
});

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// Middlerware for better error handling
app.use((err, req, res, next) => {
	res.status(500).send({ message: err.message });
});

app.listen(PORT, () => {
	console.log('Server is listening at ' + PORT);
});
