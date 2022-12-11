//Setup
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

//Middleware 
app.use(cors());

//Active Sessions
const activeSessions = [];

//Socket.io Connection
io.on("connection", (socket) => {
  //Test
  console.log(`User connected: ${socket.id}`);
  socket.on('send message', (data) => {
    socket.broadcast.emit('receive message', data)
  })
  //Send socketid
  socket.emit("me", socket.id);

  //Send activeSessions list
  socket.emit('startingActiveSessions', activeSessions);

  //Notify all other users
  socket.broadcast.emit('userOnline', `New user online: ${socket.id}`);
  //Disconnect
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

  //Joining a session
  socket.on('join_session', (data) => {
    console.log(`new session created: ${data}`)
    activeSessions.push(data) //Add this session to list of active sessions
    console.log(activeSessions);
    socket.join(data);  //Creates room
    //Return list of rooms to user
    socket.emit('getActiveSessions', activeSessions);
  })
  //Closing a session
  socket.on('exit_session', (data) => {
    console.log(activeSessions.indexOf(data));
    console.log(`session closed: ${data}`);
    console.log(activeSessions);
  })

  //Sending data only to those connected in a room
  //use .to() to specify which room/channel and emit to send
  socket.on('send message', (data) => {
    socket.to(data.room).emit('receive message', data);
  })

});

//Home route
app.get("/", (_req, res) => {
  res.json({ message: "ok" });
});

//Listen in on server
server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
