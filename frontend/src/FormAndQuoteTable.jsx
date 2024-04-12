import "./App.css";
import '@radix-ui/themes/styles.css';
import { Table, Heading, Button, Tooltip, ScrollArea, Em, TextField, Link} from '@radix-ui/themes';
import React, { useEffect, useState } from "react";

/**
 * FormAndQuoteTable component
 * This component handles the submission of quotes and the display of the quote table.
 * It includes features for searching, sorting, and filtering the quotes based on various criteria.
 */

function FormAndQuoteTable() {
	// State variables
	const [quotes, setQuotes] = useState([]); // Stores the list of quotes
	const [name, setName] = useState(''); // Stores the name input
	const [message, setMessage] = useState(''); // Stores the message input
	const [maxQuoteAge, setMaxQuoteAge] = useState(null); // Stores the maximum quote age filter
	const [sortOrder, setSortOrder] = useState('asc'); // Stores the sort order (ascending or descending)
	const [searchText, setSearchText] = useState(''); // Stores the search text
	const [timeZone, setTimeZone] = useState('UTC'); // Stores the selected time zone


	/**
	 * updateTableDates
	 * Updates the date displayed in the table based on the selected time zone.
	 * @param {string} timeZone - The time zone to be used for date formatting.
	 */
	const updateTableDates = (timeZone) => {
		const tableRows = table.getElementsByTagName('tr');
		for (let i = 1; i < tableRows.length; i++) {
		  const dateCell = tableRows[i].getElementsByTagName('td')[2];
		  const dateString = dateCell.textContent;
		  const date = new Date(dateString);
		  const options = { timeZone: timeZone, timeZoneName: 'short' };
		  const formattedDate = date.toLocaleString('en-US', options);
		  dateCell.textContent = formattedDate;
		}
	};

	/**
	 * Fetch quotes from the server
	 * This effect is triggered when the component mounts or when the filters change.
	 * It fetches the quotes from the server based on the current filters.
	 */
	useEffect(() => {
		const fetchQuotes = async () => {
			try {
			const url = new URL('/api/quotes', window.location.origin);
			if (maxQuoteAge !== null) {
				url.searchParams.set('max_age', maxQuoteAge);
			}
			url.searchParams.set('timezone', timeZone);
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
	}, [maxQuoteAge, searchText, timeZone]);



	/**
	 * Filter and sort the quotes
	 * This effect is triggered when the search text or sort order changes.
	 * It filters the quotes based on the search text and sorts them based on the sort order.
	 */
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

	/**
	 * Handle form submission
	 * This function is called when the form is submitted.
	 * It sends the new quote to the server and updates the list of quotes.
	 * @param {Event} e - The form submission event.
	 */
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
        <div>

            {/* Submission form */}
            <div className="submission-form">
				<form onSubmit={handleSubmit}>
					<div className="name-input-box">
						<TextField.Root 
							type="text"
							name="name"
							id="input-name"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Name"
						/>
					</div>

					<div className="message-input-box">
						<TextField.Root
							placeholder="Message"
							required
							value={message}
							type="text"
							name="message"
							id="input-message"
							onChange={(e) => setMessage(e.target.value)}
						/>
					</div>

					<div className="submit-button">
						<Tooltip content="Send Quote">
							<Button type="submit" variant="soft">Submit</Button>
						</Tooltip>	
					</div>
				</form>
			</div>


            {/* Previous quotes section */}
            <Heading className="heading" as="h2"> <Em>Previous Quotes</Em></Heading>


            {/* Search fields (Alphebetical sort, max age criteria, text search, and time zone selection) */}
            <div className="search-field">
					<Button variant="soft" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
						Sort {sortOrder === 'asc' ? 'By Descending Name' : 'By Ascending Name'}
					</Button>
					<TextField.Root
						placeholder="Search quotes..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>

					<TextField.Root 
						type="number"
						placeholder="Custom Max Age (days)"
						name="max-age"
						id="input-max-age"
						value={maxQuoteAge || ''}
						onChange={(e) => setMaxQuoteAge(e.target.value ? parseInt(e.target.value) : null)}
					/>

					<select
						id="quote-age-range"
						name="quote-age-range"
						value={maxQuoteAge || ''}
						onChange={(e) => setMaxQuoteAge(e.target.value || null)}
					>
						<option value="">All</option>
						<option value="7">Last Week</option>
						<option value="30">Last Month</option>
						<option value="365">Last Year</option>
					</select>

					<select
						id="time-zone"
						name="time-zone"
						value={timeZone}
						onChange={(e) => {
							setTimeZone(e.target.value);
							updateTableDates(e.target.value);
						}}
					>
						<option value="UTC">UTC</option>
						<option value="America/New_York">Eastern Time (US & Canada)</option>
						<option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
						<option value="Europe/Berlin">Central European Time</option>
						<option value="Asia/Tokyo">Japan Standard Time</option>
					</select>
			</div>
			

			{/* Quote Table */}
			<div className="quotes">
				<ScrollArea type="always" scrollbars="vertical" style={{ height: 500 }}>
					<Table.Root size="3">
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Quote</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
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
									<Table.Cell>{new Date(quote.time).toLocaleString('en-US', { timeZone: timeZone, timeZoneName: 'short' })}</Table.Cell>
									</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</ScrollArea>
			</div>
        </div>
    );
}

export default FormAndQuoteTable;