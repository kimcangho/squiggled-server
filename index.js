//.env
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const cors = require("cors");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});



app.use(cors());

//Socket.io Connection
io.on("connection", (socket) => {

});

//Home route
app.get("/", (_req, res) => {
  res.json({ message: "ok" });
});

//Listen in on server
server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
