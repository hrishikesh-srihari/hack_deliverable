import "./App.css";
import '@radix-ui/themes/styles.css';
import { Heading } from '@radix-ui/themes';
import { motion } from "framer-motion"
import FormAndQuoteTable from "./FormAndQuoteTable";
import SocialButtons from "./SocialButtons";

function App() {
	const headerTitle = "Hack at UCI Tech Deliverable".split(" ");


	return (
		<div className="App">
			<SocialButtons />

			<div className="header-image">
				<img 
					src="/Quotebook.png"
					width={75}
				/>
			</div>

			<Heading className="heading-div" size="7" color="indigo" as="h1">
				{headerTitle.map((word, index) => (
				<motion.span
					key={index}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.15 }}
				>
					{word}{" "}
				</motion.span>
				))}
			</Heading>
			<FormAndQuoteTable />
		</div>
	);
}

export default App;