import React, { useContext, useReducer, useState } from 'react';
import { Store } from '../Components/Store';
import { Helmet } from 'react-helmet-async';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../utils';

const reducer = (state, action) => {
	switch (action.type) {
		case 'UPDATE_REQUEST':
			return { ...state, loadingUpdate: true };
		case 'UPDATE_SUCCESS':
			return { ...state, loadingUpdate: false };
		case 'UPDATE_FAIL':
			return { ...state, loadingUpdate: false };
		default:
			return state;
	}
};

export default function Profile() {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;
	const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
		loadingUpdate: false,
	});

	const [name, setName] = useState(userInfo.name);
	const [email, setEmail] = useState(userInfo.email);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const submitHandler = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error('Entered passwords do not match.');
			return;
		}
		dispatch({ type: 'UPDATE_REQUEST' });
		try {
			const { data } = await axios.put(
				'/api/users/profile',
				{
					name,
					email,
					password,
				},
				{
					headers: {
						authorization: `Bearer ${userInfo.token}`,
					},
				}
			);
			dispatch({ type: 'UPDATE_SUCCESS' });
			ctxDispatch({ type: 'USER_SIGNIN', payload: data });
			toast.success('Profile has been updated successfully');
		} catch (err) {
			dispatch({ type: 'UPDATE_FAIL' });
			toast.error(getError(err));
		}
	};

	return (
		<div className="container small-container">
			<Helmet>
				<title>User Profile </title>
			</Helmet>
			<h1 className="my-3">User Profile</h1>

			<Form onSubmit={submitHandler}>
				<Form.Group className="mb-3" controlId="name">
					<Form.Label>Name*</Form.Label>
					<Form.Control
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="email">
					<Form.Label>Email*</Form.Label>
					<Form.Control
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="password">
					<Form.Label>Password*</Form.Label>
					<Form.Control
						type="password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="confirmPassword">
					<Form.Label>Confirm Password*</Form.Label>
					<Form.Control
						type="password"
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</Form.Group>
				<div className="mb-3">
					<Button type="submit">Update</Button>
				</div>
			</Form>
		</div>
	);
}
