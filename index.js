//.env
require("dotenv").config();
const PORT = process.env.PORT || 8000;

//express
const express = require("express");
const app = express();  //Call express() and puts new express application in app variable
//HTTP Server
const http = require("http"); //require http - built in node module
const server = http.createServer(app);  //create http server for repeated use e.g. for socket.io
//cors
const cors = require('cors'); //Cross-origin resource sharing request
//socket.io
const { Server } = require('socket.io');  //Require socket.io module

const io = new Server({   //constructor function for new server-side instance "io"
  cors: {
    origin: '*',          //Accessible from any origin
    methods: ['GET', 'POST']
  }
});

//CORS middleware
app.use(cors());

//Home Route
app.get("/", (req, res) => {
  res.status(200).send('Success');
});

//WebSocket: bi-directional full-duplex protocol for client-server comms.
//Stateful protocol, meaning connxn kept alive until terminated by either client or server
//After closing connxn, connxn termianted from both ends
//Client makes request --> Server returns handshake --> WebSocket connxn established

//socket.io
io.on('connection', (socket) => { //Callback provides socket
  //Emit message from socket
  socket.emit('me', socket.id) //Socket sends event named me containing socket.id string
  //Disconnect socket handler
  socket.on('disconnect', () => {
    socket.broadcast.emit('callEnded'); //Broadcast: send from server to all other connected sockets
  })
  //Call User Socket Handler
  socket.on('callUser', ({ userToCall, signalData, from, name }) => {   //Destructed from incoming data
    io.to(userToCall).emit('callUser', { signal: signalData, from, name });
  })
  //Answer Call Socket Handler
  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  })
});

//Listen in on server
server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
