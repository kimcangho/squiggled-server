//.env
require("dotenv").config();
const PORT = process.env.PORT || 8000;  //Set default port

//express
const express = require("express"); //Require express module
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
  res.status(200).json({ message: "Success" });
});

server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
