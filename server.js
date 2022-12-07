//.env
require("dotenv").config();
const PORT = process.env.PORT || 8000;
//External Modules
const express = require("express");
//Spin up server
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    //Use cors middleware
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//List users in object - order not important
const users = {};

//Video Chat App
//Listen On Connection from client
io.on("connection", (socket) => {
  //Check if user has id
  if (!users[socket.id]) {
    users[socket.id] = socket.id; //Add user with unique socket id
  }
  //emit yourID event with socket ID
  socket.emit("yourID", socket.id);
  //emit users object containing all users
  io.sockets.emit("allUsers", users);
  //Listen on disconnect event from user to delete from users object
  socket.on("disconnect", () => {
    delete users[socket.id];
  });
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
