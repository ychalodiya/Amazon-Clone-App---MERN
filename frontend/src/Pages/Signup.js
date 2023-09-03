import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Components/Store';
import { getError } from '../utils';
import CheckoutSteps from '../Components/CheckoutSteps';

export default function Signup() {
	const navigate = useNavigate();
	const { search } = useLocation();
	const redirectUrl = new URLSearchParams(search).get('redirect');
	const redirect = redirectUrl ? redirectUrl : '/';
	const name = useRef();
	const email = useRef();
	const password = useRef();
	const confirmPassword = useRef();

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password.current.value !== confirmPassword.current.value) {
			toast.error('Entered passwords do not match.');
			return;
		}

		try {
			const { data } = await axios.post('/api/users/signup', {
				name: name.current.value,
				email: email.current.value,
				password: password.current.value,
			});
			ctxDispatch({ type: 'USER_SIGNIN', payload: data });
			navigate(redirect || '/');
		} catch (err) {
			toast.error(getError(err));
		}
	};

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [userInfo, navigate, redirect]);

	return (
		<Container className="small-container">
			<Helmet>
				<title>Sign Up</title>
			</Helmet>
			<CheckoutSteps step1 />
			<h1 className="my-3">Sign Up</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group className="mb-3" controlId="name">
					<Form.Label>Name*</Form.Label>
					<Form.Control type="text" required ref={name} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="email">
					<Form.Label>Email*</Form.Label>
					<Form.Control type="email" required ref={email} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="password">
					<Form.Label>Password*</Form.Label>
					<Form.Control type="password" required ref={password} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="confirmPassword">
					<Form.Label>Confirm Password*</Form.Label>
					<Form.Control type="password" required ref={confirmPassword} />
				</Form.Group>
				<div className="mb-3">
					<Button type="submit">Sign Up</Button>
				</div>
				<div className="mb-3">
					Already have an account?{' '}
					<Link to={`/signin?redirect=${redirect}`}>Sign- In</Link>
				</div>
			</Form>
		</Container>
	);
}
