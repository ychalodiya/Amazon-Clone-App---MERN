import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
	cart: {
		cartItems: localStorage.getItem('cartItems')
			? JSON.parse(localStorage.getItem('cartItems'))
			: [],
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

		default:
			return state;
	}
}

export function StoreProvider(props) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const value = { state, dispatch };

	return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
