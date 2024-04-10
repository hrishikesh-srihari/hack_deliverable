import "./App.css";
import '@radix-ui/themes/styles.css';
import { Table, Heading } from '@radix-ui/themes';
import { useEffect, useState } from "react";

function App() {
  const [quotes, setQuotes] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ name, message }),
      });

      if (response.ok) {
        const newQuote = await response.json();
        setQuotes([...quotes, newQuote]);
        setName('');
        setMessage('');
      } else {
        console.error('Error submitting quote:', response.status);
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
    }
  };

  return (
    <div className="App">
		<h1>Hack at UCI Tech Deliverable</h1>

		<form onSubmit={handleSubmit}>
			<label htmlFor="input-name">Name</label>
			<input
			type="text"
			name="name"
			id="input-name"
			required
			value={name}
			onChange={(e) => setName(e.target.value)}
			/>

			<label htmlFor="input-message">Quote</label>

			<input
			type="text"
			name="message"
			id="input-message"
			required
			value={message}
			onChange={(e) => setMessage(e.target.value)}
			/>

			<button type="submit">Submit</button>
		</form>

		<div className="heading-div">
			<Heading as="h2"> Previous Quotes</Heading>
		</div>
		
		<div className="quotes">
			<Table.Root size="3">
				<Table.Header>
				<Table.Row>
					<Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Quote</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
				</Table.Row>
				</Table.Header>
				<Table.Body>
				{quotes.map((quote, index) => (
					<Table.Row key={index}>
					<Table.RowHeaderCell>{quote.name}</Table.RowHeaderCell>
					<Table.Cell>{quote.message}</Table.Cell>
					<Table.Cell>{quote.time}</Table.Cell>
					</Table.Row>
				))}
				</Table.Body>
			</Table.Root>
		</div>
	</div>
	);
}

export default App;