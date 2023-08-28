import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Product from './Components/Product';

function App() {
	return (
		<BrowserRouter>
			<div>
				<header>
					<Link to="/">Amazon Marketplace</Link>
				</header>
				<main>
					<Routes>
						<Route path="/product/:slug" element={<Product />} />
						<Route path="/" element={<Home />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;
