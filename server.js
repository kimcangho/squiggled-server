//ENV
require("dotenv").config();
const PORT = process.env.SERVER_PORT || 8080;

//Express Server
const express = require("express");
const app = express();

app.get('/', (_req,res) => {
  res.send('test')
})

//HTTP Server
const http = require("http");
const server = http.createServer(app);
//Websocket Server for Web Signaling
const cors = require("cors");
const { Server } = require("socket.io");
const io = new Server(server, {cors: {}});

//Handler Modules
const roomHandler = require("./handlers/roomHandler.js");
const whiteboardHandler = require("./handlers/whiteboardHandler.js");

//Listen on server connection
io.on("connection", (socket) => {

  //Connection/Disconnection
  console.log(`User with socket id ${socket.id} has connected`);
  socket.on("disconnect", () => {
    console.log(`User with socket id ${socket.id} has disconnected`);
  });

  //Handlers
  roomHandler(socket);
  whiteboardHandler(socket);

});

server.listen(PORT, () => {
  console.log(`Listening to server PORT:${PORT}`);
});
