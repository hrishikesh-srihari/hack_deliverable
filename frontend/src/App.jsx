import "./App.css";
import { useEffect, useState } from "react";

function App() {
	const [quotes, setQuotes] = useState([]);

	useEffect(() => {
		const fetchQuotes = async () => {
		try {
			const response = await fetch('/api/quotes');
			if (response.ok) {
			const data = await response.json();
			setQuotes(data);
			} else {
			console.error('Error fetching quotes:', response.status);
			}
		} catch (error) {
			console.error('Error fetching quotes:', error);
		}
		};

		fetchQuotes();
	}, []);


	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<h1>Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form action="/api/quote" method="post">
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required />
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required />
				<button type="submit">Submit</button>
			</form>

			<h2>Previous Quotes</h2>
			{/* TODO: Display the actual quotes from the database */}
			<div className="quotes">
			<ul>
				{quotes.map((quote, index) => (
					<li key={index}>
					<p>Name: {quote.name}</p>
					<p>Message: {quote.message}</p>
					<p>Time: {quote.time}</p>
					</li>
				))}
			</ul>
			</div>
		</div>
	);
}

export default App;
