const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = 3000;
let users = [];
let messages = [];
let index = 0;

io.on("connection", socket => {
	socket.emit("loggedIn", {
		users: users.map(s => s.username),
		messages: messages
	});


	socket.on("newuser", username => {
		console.log(`${username} connected.`);
		socket.username = username;
		users.push(socket);

		io.emit("userOnline", socket.username);
	});

	socket.on("msg", msg => {
		console.log(msg);
		let message = {
			index: index,
			username: socket.username,
			msg: msg
		}

		messages.push(message);

		io.emit("msg", message);

		index++;
	});


	// Disconnect
	socket.on("disconnect", () => {
		console.log(`${socket.username} disconnected.`);
		io.emit("userLeft", socket.username);
		users.splice(users.indexOf(socket), 1);
	});
});


http.listen(port, () => {
	console.log(`Listening on port ${port}`)
});