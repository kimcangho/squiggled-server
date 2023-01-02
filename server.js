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

io.on("connection", (socket) => {
    console.log(socket)
})

server.listen(PORT, () => {
    console.log(`Listening to server PORT:${PORT}`)
})