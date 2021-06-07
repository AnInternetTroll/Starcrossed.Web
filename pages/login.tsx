import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import styles from "../styles/Login.module.scss";
import { Api } from "../components/utils";
import { FormEvent, useState } from "react";

export default function Login() {
	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justify="center"
		>
			<Grid item>
				<Paper elevation={6} className={styles.loginBox}>
					<LoginForm />
				</Paper>
			</Grid>
		</Grid>
	);
}

function LoginForm() {
	const [loginFeedback, setLoginFeedback] = useState(null);

	const loginUser = (e: FormEvent) => {
		e.preventDefault();
		const form = new FormData(e.target as HTMLFormElement);
		Api.login(
			form.get("username").toString(),
			form.get("password").toString()
		).then((res) => {
			if (res.status >= 400)
				setLoginFeedback({ ok: false, text: res.data.message });
			else {
				setLoginFeedback({ ok: true, text: res.data.message });
				location.href = "/app";
			}
		});
	};
	return (
		<form onSubmit={loginUser}>
			<Typography>Login</Typography>
			<TextField autoFocus name="username" label="Username" />
			<TextField name="password" label="Password" type="password" />
			<Button type="submit">Login</Button>
			{loginFeedback ? (
				<Alert
					variant="filled"
					severity={loginFeedback.ok ? "success" : "error"}
				>
					{loginFeedback.text}
				</Alert>
			) : (
				""
			)}
		</form>
	);
}
