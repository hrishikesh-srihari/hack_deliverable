import "./App.css";
import '@radix-ui/themes/styles.css';
import { Table, Heading } from '@radix-ui/themes';
import { useEffect, useState } from "react";

function App() {
  const [quotes, setQuotes] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [maxQuoteAge, setMaxQuoteAge] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchQuotes = async () => {
		try {
		  const url = new URL('/api/quotes', window.location.origin);
		  if (maxQuoteAge !== null) {
			url.searchParams.set('max_age', maxQuoteAge);
		  }
		  const response = await fetch(url);
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
  }, [maxQuoteAge]);

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

		<label htmlFor="input-max-age">Max Quote Age (days)</label>
		<input
		type="number"
		name="max-age"
		id="input-max-age"
		value={maxQuoteAge || ''}
		onChange={(e) => setMaxQuoteAge(e.target.value ? parseInt(e.target.value) : null)}
		/>

		

		<div className="heading-div">
			<Heading as="h2"> Previous Quotes</Heading>
			<button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
				Sort {sortOrder === 'asc' ? 'Descending Name' : 'Ascending Name'}
			</button>
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
				{quotes
					.sort((a, b) => {
						if (a.name < b.name) return sortOrder === 'asc' ? -1 : 1;
						if (a.name > b.name) return sortOrder === 'asc' ? 1 : -1;
						if (a.message < b.message) return sortOrder === 'asc' ? -1 : 1;
						if (a.message > b.message) return sortOrder === 'asc' ? 1 : -1;
						return 0;
					})
					.map((quote, index) => (
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