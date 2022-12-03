require("dotenv").config();

const express = require("express"); //Require express module
const app = express();  //Call express() and puts new express application in app variable

const http = require("http"); //require http - built in node module
const server = http.createServer(app);  //create http server for repeated use e.g. for socket.io

const PORT = process.env.PORT || 8000;  //Set default port

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success" });
});

server.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
