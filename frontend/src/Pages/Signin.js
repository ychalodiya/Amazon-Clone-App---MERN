import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Components/Store';
import { getError } from '../utils';
import CheckoutSteps from '../Components/CheckoutSteps';

export default function Signin() {
	const navigate = useNavigate();
	const { search } = useLocation();
	const redirectUrl = new URLSearchParams(search).get('redirect');
	const redirect = redirectUrl ? redirectUrl : '/';
	const email = useRef();
	const password = useRef();

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;

	const submitHandler = async (e) => {
		e.preventDefault();

		try {
			const { data } = await axios.post('/api/users/signin', {
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
				<title>Sign In</title>
			</Helmet>
			<CheckoutSteps step1 />
			<h1 className="my-3">Sign In</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group className="mb-3" controlId="email">
					<Form.Label>Email*</Form.Label>
					<Form.Control type="email" required ref={email} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="password">
					<Form.Label>Password*</Form.Label>
					<Form.Control type="password" required ref={password} />
				</Form.Group>
				<div className="mb-3">
					<Button type="submit">Submit</Button>
				</div>
				<div className="mb-3">
					New Customer?{' '}
					<Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
				</div>
			</Form>
		</Container>
	);
}
