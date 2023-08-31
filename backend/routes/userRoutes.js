import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import { generateToken } from '../utils.js';

const userRouter = express.Router();

userRouter.post(
	'/signin',
	expressAsyncHandler(async (req, res) => {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			if (bcrypt.compareSync(req.body.password, user.password)) {
				res.send({
					_id: user._id,
					email: user.email,
					name: user.name,
					isAdmin: user.isAdmin,
					token: generateToken(user),
				});
				return;
			}
		}
		res.status(401).send({ message: 'Invalid email or password' });
	})
);

export default userRouter;
