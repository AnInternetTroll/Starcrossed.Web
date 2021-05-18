import "../styles/globals.css";
import "@fontsource/roboto";
import { FC } from "react";
import Head from "next/head";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "../components/state";

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
				<Component {...pageProps} />
			</Provider>
		</div>
	);
}
