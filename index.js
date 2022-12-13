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

  //Send socketid
  socket.emit("me", socket.id);
  //Send activeSessions list
  socket.emit("getActiveSessions", activeSessions);
  //Disconnect
  socket.on("disconnect", () => {
    socket.emit("call has ended");
  });

  //Creating a session
  socket.on("create_session", (data) => {
    if (
      !activeSessions.find((session) => {
        return session === data;
      })
    ) {
      activeSessions.push(data);
    }
    socket.join(data); //Creates room
    io.emit("getActiveSessions", activeSessions);
  });
  //Joining a session
  socket.on("join_session", (sessionData, userData) => {
    console.log(sessionData, userData);
    socket.join(sessionData);
    io.to(sessionData).emit(
      "join-confirm",
      userData,
      sessionData,
      `${userData} has ${sessionData}'s session!`
    );
  });
  //Closing a session
  socket.on("exit_session", (sessionData, userData) => {
    console.log(userData + " are leaving " + sessionData);
    const indexToRemove = activeSessions.indexOf(sessionData); //Find matching index
    activeSessions.splice(indexToRemove, 1); //Remove from activeSessions
    io.emit("getActiveSessions", activeSessions);
    socket.leave(sessionData);
    // socket.leave(userData);
    io.to(sessionData).emit("exit-room");
  });

  //SimplePeer

  //Calling a peer
  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });
  //Getting a call from another peer
  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  //Capture Photo
  socket.on('send_screenshot', (data,session) => {
    console.log(`Photo taken of session:`)
    console.log(session);
    io.to(session).emit('confirm_screenshot', data)
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
