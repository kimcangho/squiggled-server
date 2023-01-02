const { v4: uuidv4 } = require("uuid");

const roomHandler = (socket) => {
  const createRoom = () => {
    const roomId = uuidv4();
    socket.join(roomId);
    socket.emit("room-created", { roomId });
    console.log("user has created room!");
  };
  const joinRoom = ({ roomId }) => {
    console.log(`user has joined room ${roomId}`);
  };
  //Socket Room Listeners
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};

module.exports = roomHandler;
