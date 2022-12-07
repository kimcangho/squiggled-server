//.env
require("dotenv").config();
const PORT = process.env.PORT || 8000;

const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

server.listen(8000, () => console.log(`Server running on port: ${PORT}`))