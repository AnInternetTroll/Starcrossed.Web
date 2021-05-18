import { useTracked } from "../../components/state";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { FormEvent, useEffect, useState } from "react";
import { Api } from "../../components/utils";

export default function Main() {
	const [rooms, setRooms] = useState([]);
	const [room, setRoom] = useState(null);

	useEffect(() => {
		Api.graphql(
			`
			query {
				rooms {
				  name
				  _id
				  members {
					  _id
					  username
				  }
				  owner {
					  username
					  _id
				  }
				}
			  }
			`
		).then((data) => {
			setRooms(data?.data.rooms);
			setRoom(rooms[0]);
		});
	}, [setRoom, setRooms]);

	return (
		<Grid container spacing={3}>
			<ChannelsSidebar
				rooms={rooms}
				setRooms={setRooms}
				setRoom={setRoom}
				currentRoom={room}
			/>
			<Grid item style={{ flexGrow: 1 }}>
				<Chat room={room} />
			</Grid>
			{/* <UsersSidebar room={room} /> */}
		</Grid>
	);
}

function Chat({ room }: { room?: any }) {
	if (!room) return <p>Loading...</p>;

	const [messages, setMessages] = useState([]);

	useEffect(() => {
		Api.graphql(
			`
		{
			messages(room:"${room._id}") {
				_id
				content
				author {
					username
				}
			}
		}
		`
		).then((data) => {
			setMessages(data.data?.messages);
		});
	}, [room, setMessages]);

	const postMessageEvent = async (e: FormEvent) => {
		e.preventDefault();
		const form = new FormData(e.target as HTMLFormElement);
		const msg = await Api.graphql(`
			mutation {
				messagePost(content:"${form.get("content")}" room:"${room._id}") {
					author {
						username
					}
					content
				}
			}
		`);
		setMessages((msgs) => [...msgs, msg.data.messagePost]);
	};

	return (
		<div style={{ bottom: 5, position: "absolute" }}>
			{messages.map((msg) => (
				<Message message={msg} />
			))}
			<form onSubmit={postMessageEvent}>
				<TextField
					id="standard-multiline-flexible"
					label="Multiline"
					multiline
					rowsMax={4}
					name="content"
					required
				/>
				<Button type="submit" variant="outlined">
					Post
				</Button>
			</form>
		</div>
	);
}

function ChannelsSidebar({ rooms, setRooms, setRoom, currentRoom }) {
	return (
		<Drawer
			variant="permanent"
			style={{ display: "flex", zIndex: 10, width: 240 }}
		>
			<Toolbar />
			<Rooms
				currentRoom={currentRoom}
				rooms={rooms}
				setRooms={setRooms}
				setRoom={setRoom}
			/>
		</Drawer>
	);
}

function Rooms({ rooms, setRooms, setRoom, currentRoom }) {
	if (typeof window === "undefined") return <p>Loading...</p>;

	return (
		<List>
			<AddNewRoomListItem setRooms={setRooms} />
			<Divider />
			{/* Channel list */}
			{rooms.map((item) => (
				<RoomInList
					currentRoom={currentRoom}
					key={item._id}
					room={item}
					onClick={() => setRoom(item)}
				/>
			))}
		</List>
	);
}

function RoomInList({ room, onClick, currentRoom }) {
	return (
		<ListItem>
			<Button
				variant={
					currentRoom?._id == room._id ? "outlined" : "contained"
				}
				onClick={onClick}
			>
				{room.name}
			</Button>
		</ListItem>
	);
}

function AddNewRoomListItem({ setRooms }) {
	const [open, handleOpen] = useState(false);
	const [addRoomFeedback, setAddRoomFeedback] = useState<{
		error?: string;
		success?: string;
		new: boolean;
	}>({
		error: "",
		success: "",
		new: false,
	});
	const addRoomEvent = (e: FormEvent) => {
		e.preventDefault();
		const form = new FormData(e.target as HTMLFormElement);
		const name = form.get("name");
		const description = form.get("description");
		Api.graphql(
			`mutation {
				roomCreateNew(description:"${description}" name:"${name}") {
					name
					_id
				}
			}`
		).then((data) => {
			if (data.error) {
				setAddRoomFeedback({
					error: `${data.code}: ${data?.error}`,
					new: true,
				});
			} else {
				setAddRoomFeedback({ success: "Room added", new: true });
				setRooms((rooms) => [...rooms, data.data.roomCreateNew]);
				handleOpen(!open);
			}
		});
	};
	return (
		<ListItem>
			{/* Add new room menu */}
			<Snackbar open={addRoomFeedback.new} autoHideDuration={6000}>
				<Alert
					onClose={() => setAddRoomFeedback({ new: false })}
					severity={addRoomFeedback.error ? "error" : "success"}
				>
					{addRoomFeedback.error
						? addRoomFeedback.error
						: addRoomFeedback.success}
				</Alert>
			</Snackbar>
			<Button onClick={() => handleOpen(!open)}>Add a new room</Button>
			<Dialog
				open={open}
				onClose={() => handleOpen(false)}
				aria-labelledby="form-dialog-title"
			>
				<form onSubmit={addRoomEvent}>
					<DialogTitle id="form-dialog-title">
						Add a new room!
					</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Room Name"
							type="text"
							name="name"
						/>
						<TextField
							id="standard-basic"
							label="Description"
							name="description"
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => handleOpen(false)}
							color="primary"
						>
							Cancel
						</Button>
						<Button type="submit" color="primary">
							Add
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</ListItem>
	);
}
function Alert(props: AlertProps) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Message({ message }) {
	return (
		<Card>
			<CardHeader title={"Author: " + message.author.username} />
			<CardContent>{message.content}</CardContent>
		</Card>
	);
}

function UsersSidebar({ room, ...props }) {
	if (!room) return <p>Loading...</p>;
	const [open, setOpen] = useState(false);
	return (
		<div style={{ bottom: 5, position: "absolute" }}>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="form-dialog-title"
			>
				<form onSubmit={(e) => e.preventDefault() /* add logic here */}>
					<DialogTitle id="form-dialog-title">
						Who do you want to add?
					</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							label="User"
							type="text"
							name="username"
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setOpen(false)} color="primary">
							Cancel
						</Button>
						<Button type="submit" color="primary">
							Add
						</Button>
					</DialogActions>
				</form>
			</Dialog>
			<Drawer variant="permanent" {...props}>
				<Toolbar />
				<List>
					<Button onClick={() => setOpen(!open)}>Add new user</Button>
					<Divider />
					{/* Channel list */}
					{room.members.map((user) => (
						<ListItem>{user.username}</ListItem>
					))}
				</List>
			</Drawer>
		</div>
	);
}
