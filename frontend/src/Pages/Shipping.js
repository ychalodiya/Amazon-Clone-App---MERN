import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Components/Store';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../Components/CheckoutSteps.js';

export default function Shipping() {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		userInfo,
		cart: { shippingAddress },
	} = state;
	const navigate = useNavigate();

	const [fullName, setFullName] = useState(shippingAddress.fullName || '');
	const [address, setAddress] = useState(shippingAddress.address || '');
	const [city, setCity] = useState(shippingAddress.city || '');
	const [postalCode, setPostalCode] = useState(
		shippingAddress.postalCode || ''
	);
	const [country, setCountry] = useState(shippingAddress.country || '');
	const submitHandler = (e) => {
		console.log('submit');
		e.preventDefault();
		ctxDispatch({
			type: 'SAVE_SHIPPING_ADDRESS',
			payload: {
				fullName,
				address,
				city,
				postalCode,
				country,
			},
		});
		navigate('/payment');
	};

	useEffect(() => {
		if (!userInfo) {
			navigate('/signin?redirect=/shipping');
		}
	}, [userInfo, navigate]);

	return (
		<div>
			<Helmet>
				<title>Shipping Address</title>
			</Helmet>
			<CheckoutSteps step1 step2 />
			<div className="container small-container">
				<h3 className="text-center">Shipping address</h3>
				<Form className="" onSubmit={submitHandler}>
					<Form.Group className="mb-3" controlId="fullname">
						<Form.Label>Full Name </Form.Label>
						<Form.Control
							type="text"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="address">
						<Form.Label>Address </Form.Label>
						<Form.Control
							type="text"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="city">
						<Form.Label>City </Form.Label>
						<Form.Control
							type="text"
							value={city}
							onChange={(e) => setCity(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="address">
						<Form.Label>Postal Code </Form.Label>
						<Form.Control
							type="text"
							value={postalCode}
							onChange={(e) => setPostalCode(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="country">
						<Form.Label>Country </Form.Label>
						<Form.Control
							type="text"
							value={country}
							onChange={(e) => setCountry(e.target.value)}
							required
						/>
					</Form.Group>
					<div className="mb-3">
						<Button variant="primary" type="submit">
							Continue
						</Button>
					</div>
				</Form>
			</div>
		</div>
	);
}
