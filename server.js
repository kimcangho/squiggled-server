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
const roomHandler = require("./roomHandler/roomHandler.js");

//Listen on server connection
io.on("connection", (socket) => {
  //Connection/Disconnection
  console.log(`User with socket id ${socket.id} has connected`);
  socket.on("disconnect", () => {
    console.log(`User with socket id ${socket.id} has disconnected`);
  });
  //Room Handler
  roomHandler(socket);
});

server.listen(PORT, () => {
  console.log(`Listening to server PORT:${PORT}`);
});
