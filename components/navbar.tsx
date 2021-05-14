import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import { FormEvent, useState } from "react";
import { sha256, getItem, setItem, Api } from "./utils";
import styles from "../styles/Navbar.module.scss";
import { useTracked } from "./state";

export default function Navbar() {
	const [globalState, setGlobalState] = useTracked();
	const [open, handleOpen] = useState(false);
	const [loginState, setLoginState] = useState("");
	const login = async (username, password) => {
		password = await sha256(password);
		const basic = btoa(`${username}:${password}`);
		setItem("basic", basic);
		const res = await fetch(`${process.env.base_url}/auth/token`, {
			headers: {
				Authorization: `Basic ${basic}`,
			},
		});
		const response = await res.json();
		if (res.ok) {
			setLoginState(`Succesful: ${response.message}`);
			setItem("token", response.token);
			handleOpen(!open);
			const { data, error, code } = await Api.graphql(`{
					viewer {
						username
						_id
						bio
						created_at
				}
			}`);
			if (!error) setGlobalState((s) => ({ user: data.viewer, ...s }));
		} else setLoginState(`Error: ${response.message}`);
	};
	return (
		<nav style={{ display: "flex" }}>
			<AppBar position="fixed" style={{ zIndex: 99 }}>
				<Toolbar>
					<Typography variant="h6">
						<Button
							color="inherit"
							onClick={() => handleOpen(!open)}
						>
							Login
						</Button>
					</Typography>
				</Toolbar>
			</AppBar>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={open}
				onClose={() => handleOpen(!open)}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className={styles.login}>
						<h2>Login</h2>
						<form
							onSubmit={(e: FormEvent) => {
								e.preventDefault();
								const formData = new FormData(
									e.target as HTMLFormElement
								);
								login(
									formData.get("username"),
									formData.get("password")
								);
							}}
						>
							<TextField
								id="standard-basic"
								label="Username"
								name="username"
							/>
							<br />
							<TextField
								id="standard-basic"
								label="Password"
								name="password"
							/>
							<br />
							<Button type="submit">Login</Button>
							<p>{loginState}</p>
						</form>
					</div>
				</Fade>
			</Modal>
		</nav>
	);
}
