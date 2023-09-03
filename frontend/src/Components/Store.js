import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
	userInfo: localStorage.getItem('userInfo')
		? JSON.parse(localStorage.getItem('userInfo'))
		: null,
	cart: {
		cartItems: localStorage.getItem('cartItems')
			? JSON.parse(localStorage.getItem('cartItems'))
			: [],
		shippingAddress: localStorage.getItem('shippingAddress')
			? JSON.parse(localStorage.getItem('shippingAddress'))
			: {},
	},
};

function reducer(state, action) {
	switch (action.type) {
		case 'Add_To_Cart':
			const newItem = action.payload;
			const productExist = state.cart.cartItems.find(
				(item) => item._id === newItem._id
			);
			const cartItems = productExist
				? state.cart.cartItems.map((item) =>
						item._id === productExist._id ? newItem : item
				  )
				: [...state.cart.cartItems, newItem];
			localStorage.setItem('cartItems', JSON.stringify(cartItems));
			return {
				...state,
				cart: {
					...state.cart,
					cartItems,
				},
			};

		case 'REMOVE_FROM_CART':
			const newCartItems = state.cart.cartItems.filter(
				(item) => item._id !== action.payload._id
			);
			localStorage.setItem('cartItems', JSON.stringify(newCartItems));

			return {
				...state,
				cart: {
					...state.cart,
					cartItems: newCartItems,
				},
			};

		case 'USER_SIGNIN':
			localStorage.setItem('userInfo', JSON.stringify(action.payload));
			return { ...state, userInfo: action.payload };

		case 'USER_SIGNOUT':
			localStorage.removeItem('userInfo');
			localStorage.removeItem('shippingAddress');
			return {
				...state,
				userInfo: null,
				cart: {
					cartItems: [],
					shippingAddress: {},
				},
			};

		case 'SAVE_SHIPPING_ADDRESS':
			localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
			return {
				...state,
				cart: {
					...state.cart,
					shippingAddress: action.payload,
				},
			};

		default:
			return state;
	}
}

export function StoreProvider(props) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const value = { state, dispatch };

	return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
