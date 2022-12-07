//.env
require("dotenv").config();
const PORT = process.env.PORT || 8000;
//Modules
const cors = require("cors");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

//allow cors
app.use(cors());

//List users in object - order not important
const users = {};

//Video Chat App
//Listen On Connection from client
io.on("connection", (socket) => {
//   console.log(socket);
//   console.log(socket.id);
  console.log(`User connected on socket: ${socket.id}`);
  //Check if user has id
  if (!users[socket.id]) {
    users[socket.id] = socket.id; //Add user with unique socket id
  }

  //emit yourID event with socket ID
  socket.emit("yourID", socket.id);

  //emit sockets
});

// //Chat app
// //Listen for connection event using callback that returns a socket
// io.on('connection', socket => {
//     //.on() => listen on an event
//     //.emit() => emit an event

//     //emits actual socket
//     socket.emit('your id', socket.id);
//     //send event to all connected
//     socket.on('send message', body => {
//         //Send back message to all clients
//         io.emit('messsage', body)
//     })
// })

server.listen(8000, () => console.log(`Server running on port: ${PORT}`));
