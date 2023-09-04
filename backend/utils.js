import jwt from 'jsonwebtoken';
export const generateToken = (user) => {
	return jwt.sign(
		{
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '30d',
		}
	);
};

// middleware function for extracting userinfo from the bearer token
export const isAuth = (req, res, next) => {
	const authorization = req.headers.authorization;
	if (authorization) {
		const token = authorization.slice(7, authorization.length); // Bearer TOKEN
		jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
			if (err) {
				res.status(401).send({ message: 'Invalid token' });
			}
			req.user = decode;
		});
	} else {
		res.status(401).send({ message: "Authorization token isn't available" });
	}

	next();
};
