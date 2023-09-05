import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Components/LoadingBox';
import MessageBox from '../Components/MessageBox';
import { Store } from '../Components/Store';
import { useNavigate } from 'react-router-dom';
import { getError } from '../utils';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, orders: action.payload, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

export default function OrderHistory() {
	const navigate = useNavigate();
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;
	const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
		loading: true,
		error: '',
		orders: [],
	});

	const fetchData = async () => {
		dispatch({ type: 'FETCH_REQUEST' });
		try {
			const { data } = await axios.get('/api/orders/mine', {
				headers: {
					authorization: `Bearer ${userInfo.token}`,
				},
			});
			dispatch({ type: 'FETCH_SUCCESS', payload: data });
		} catch (err) {
			dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
		}
	};

	useEffect(() => {
		fetchData();
	}, [userInfo]);

	return (
		<div>
			<Helmet>
				<title>Order History</title>
			</Helmet>
			<h1>Order History</h1>
			{loading ? (
				<LoadingBox />
			) : error ? (
				<>
					<Helmet>
						<title> {error} </title>
					</Helmet>
					<MessageBox variant="danger">{error}</MessageBox>
				</>
			) : (
				<table className="table">
					<thead>
						<tr className="text-center">
							<td className="text-left">ORDER ID</td>
							<td>DATE</td>
							<td>TOTAL</td>
							<td>PAID</td>
							<td>DELIVERED</td>
							<td>ACTIONS</td>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order._id}>
								<td>{order._id}</td>
								<td className="text-center">
									{order.createdAt.substring(0, 10)}
								</td>
								<td className="text-center">{order.totalPrice.toFixed(2)}</td>
								<td className="text-center">
									{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
								</td>
								<td className="text-center">
									{order.isDelivered
										? order.deliveredAt.substring(0, 10)
										: 'No'}
								</td>
								<td className="text-center">
									<Button
										type="button"
										variant="light"
										onClick={() => {
											navigate(`/orders/${order._id}`);
										}}
									>
										Details
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
