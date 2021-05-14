import "../styles/globals.css";
import "@fontsource/roboto";
import { FC } from "react";
import Head from "next/head";
import CssBaseline from "@material-ui/core/CssBaseline";
import Navbar from "../components/navbar";
import { Provider } from "../components/state";
import { ApolloProvider } from "@apollo/client/react";

export default function StarCrossed({
	Component,
	pageProps,
}: {
	Component: FC;
	pageProps: unknown;
}) {
	return (
		<div style={{ display: "flex" }}>
			<Provider>
					<Head>
						<meta
							name="viewport"
							content="minimum-scale=1, initial-scale=1, width=device-width"
						/>
					</Head>
					<CssBaseline />
					<Navbar />
					<Component {...pageProps} />
			</Provider>
		</div>
	);
}
