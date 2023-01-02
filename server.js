//ENV
require("dotenv").config();
const PORT = process.env.PORT;
//Express Server
const express = require("express");
const app = express();
//HTTP Server
const http = require("http");
const server = http.createServer(app);
//Websocket Server for Web Signaling
const cors = require("cors");
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
//Other Modules
const { v4: uuidv4 } = require("uuid");

//Listen on server connection
io.on("connection", (socket) => {
  //Connection/Disconnection
  console.log(`User with socket id ${socket.id} has connected`);
  //Listen for user disconnect event
  socket.on("disconnect", () => {
    console.log(`User with socket id ${socket.id} has disconnected`);
  });

  //Room Handlers
  // roomHandler(socket);
  const createRoom = () => {
    const roomId = uuidv4();
    socket.join(roomId);
    socket.emit("room-created", { roomId });
    console.log("user has created room!");
  };
  const joinRoom = ({ roomId }) => {
    console.log(`user has joined room ${roomId}`);
  };
  //Socket Room Listeners
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
});

server.listen(PORT, () => {
  console.log(`Listening to server PORT:${PORT}`);
});
