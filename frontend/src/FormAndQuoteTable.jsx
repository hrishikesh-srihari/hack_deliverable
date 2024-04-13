import "./App.css";
import '@radix-ui/themes/styles.css';
import { Table, Heading, Button, Tooltip, ScrollArea, Em, TextField, DropdownMenu} from '@radix-ui/themes';
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


    // Maps timezone values to their labels for Dropdown Menu component
    const timeZoneLabels = {
        'UTC': 'UTC',
        'America/New_York': 'Eastern Time (US & Canada)',
        'America/Los_Angeles': 'Pacific Time (US & Canada)',
        'Europe/Berlin': 'Central European Time',
        'Asia/Tokyo': 'Japan Standard Time'
    };


    // Maps max quote age values to their labels for Dropdown Menu component
    const maxQuoteAgeLabels = {
        'All': 'All',
        '7': 'Last Week',
        '30': 'Last Month',
        '365': 'Last Year'
      };




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


    // Handle time zone change
    const handleTimeZoneChange = (value) => {
        setTimeZone(value);
        updateTableDates(value);
    };


    return (
        <div>

            {/* Submission form */}
            <div className="submission-form">
                <form onSubmit={handleSubmit}>

                    {/* Name input field */}
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


                    {/* Message input field */}
                    <div>
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

                    {/* Submit button */}
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

                    {/* Button for sorting quotes alphabetically */}
                    <Button className="sorting-button" variant="soft" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        Sort {sortOrder === 'asc' ? 'By Descending Name' : 'By Ascending Name'}
                    </Button>
                    <TextField.Root
                        placeholder="Search quotes..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />


                    {/* Text field for setting a custom max age parameter */}
                    <TextField.Root 
                        type="number"
                        placeholder="Custom Max Age"
                        name="max-age"
                        id="input-max-age"
                        onChange={(e) => setMaxQuoteAge(e.target.value ? parseInt(e.target.value) : null)}
                    />


                    {/* Dropdown menu for setting a time interval for quote retrieval */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger className="quoteage-dropdown-trigger">
                            <Button variant="soft">
                                {maxQuoteAgeLabels[maxQuoteAge] || 'All'}
                            <DropdownMenu.TriggerIcon />
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <DropdownMenu.Item onSelect={() => setMaxQuoteAge(null)}>{maxQuoteAgeLabels["All"]}</DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={() => setMaxQuoteAge("7" || {maxQuoteAge})}>{maxQuoteAgeLabels["7"]}</DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={() => setMaxQuoteAge("30" || {maxQuoteAge})}>{maxQuoteAgeLabels["30"]}</DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={() => setMaxQuoteAge("365" || {maxQuoteAge})}>{maxQuoteAgeLabels["365"]}</DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>

                    
                    {/* Dropdown menu for setting a value for time zone on quote table */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger className="timezone-dropdown-trigger">
                            <Button variant="soft">
                                {timeZoneLabels[timeZone] || timeZone}
                            <DropdownMenu.TriggerIcon />
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <DropdownMenu.Item onSelect={() => handleTimeZoneChange('UTC')}>UTC</DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={() => handleTimeZoneChange('America/New_York')}>Eastern Time (US & Canada)</DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={() => handleTimeZoneChange('America/Los_Angeles')}>Pacific Time (US & Canada)</DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={() => handleTimeZoneChange('Europe/Berlin')}>Central European Time</DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={() => handleTimeZoneChange('Asia/Tokyo')}>Japan Standard Time</DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
            </div>
            

            {/* Quote Table */}
            <div className="quote-table">
                <ScrollArea type="always" scrollbars="vertical" style={{ height: 500 }}>

                    {/* Table with values for qutoes */}
                    <Table.Root size="3" variant="ghost" layout={"auto"}>
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