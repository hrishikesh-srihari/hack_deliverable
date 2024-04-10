import "./App.css";
import '@radix-ui/themes/styles.css';
import { Table, Heading, Button, ScrollArea, Em, TextField } from '@radix-ui/themes';


import { useEffect, useState } from "react";

function App() {
  const [quotes, setQuotes] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [maxQuoteAge, setMaxQuoteAge] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchText, setSearchText] = useState('');

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
  }, [maxQuoteAge, searchText]);



  useEffect(() => {
    const filterQuotes = () => {
      if (!searchText) {
        return quotes;
      }
      return quotes.filter(
        (quote) =>
          quote.name.toLowerCase().includes(searchText.toLowerCase()) ||
          quote.message.toLowerCase().includes(searchText.toLowerCase())
      );
    };

    const filteredQuotes = filterQuotes();
    filteredQuotes.sort((a, b) => {
      if (a.name < b.name) return sortOrder === 'asc' ? -1 : 1;
      if (a.name > b.name) return sortOrder === 'asc' ? 1 : -1;
      if (a.message < b.message) return sortOrder === 'asc' ? -1 : 1;
      if (a.message > b.message) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setQuotes(filteredQuotes);
  }, [searchText, sortOrder, quotes]);



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
		<Heading className="heading-div" as="h1">Hack at UCI Tech Deliverable</Heading>
		<div className="submission-form">
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

				<Button className="submit-button" type="submit" variant="soft">Submit</Button>
			</form>

			<div className="search-quotes">
				<TextField.Root
					placeholder="Search quotes..."
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</div>
		</div>
		

		<div className="input-label">
			<label htmlFor="input-max-age">Max Quote Age (days)</label>

			<input
			type="number"
			name="max-age"
			id="input-max-age"
			value={maxQuoteAge || ''}
			onChange={(e) => setMaxQuoteAge(e.target.value ? parseInt(e.target.value) : null)}
			/>
		</div>

		

		<div className="heading-div">
			<Heading as="h2"> <Em>Previous Quotes</Em></Heading>
			<Button variant="soft" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
				Sort {sortOrder === 'asc' ? 'Descending Name' : 'Ascending Name'}
			</Button>
		</div>
		
		<div className="quotes">
			<ScrollArea type="always" scrollbars="vertical" style={{ height: 500 }}>
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
			</ScrollArea>
		</div>
	</div>
	);
}

export default App;