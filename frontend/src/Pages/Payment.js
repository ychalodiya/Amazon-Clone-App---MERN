import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../Components/CheckoutSteps';
import { Button, Form } from 'react-bootstrap';
import { Store } from '../Components/Store';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
	const navigate = useNavigate();
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		cart: { shippingAddress, paymentMethod },
	} = state;
	const [paymentMethodName, setPaymentMethod] = useState(
		paymentMethod || 'PayPal'
	);

	useEffect(() => {
		if (!shippingAddress.address) {
			navigate('/shipping');
		}
	}, [shippingAddress, navigate]);

	const submitHandler = (e) => {
		e.preventDefault();
		ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
		localStorage.setItem('paymentMethod', paymentMethodName);
		navigate('/placeOrder');
	};

	return (
		<>
			<Helmet>
				<title>Payment method</title>
			</Helmet>
			<CheckoutSteps step1 step2 step3 />
			<div className="container small-container">
				<h1 className="my-3">Payment method</h1>
				<Form onSubmit={submitHandler}>
					<div className="mb-3">
						<Form.Check
							type="radio"
							id="PayPal"
							value="PayPal"
							label="PayPal"
							checked={paymentMethodName === 'PayPal'}
							onChange={(e) => setPaymentMethod(e.target.value)}
						/>
					</div>
					<div className="mb-3">
						<Form.Check
							type="radio"
							id="Stripe"
							value="Stripe"
							label="Stripe"
							checked={paymentMethodName === 'Stripe'}
							onChange={(e) => setPaymentMethod(e.target.value)}
						/>
					</div>
					<div className="mb-3">
						<Button type="submit">Continue</Button>
					</div>
				</Form>
			</div>
		</>
	);
}
