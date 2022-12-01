require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success" });
});

server.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
