// import { Socket } from "socket.io";

export const roomHandler = (socket) => {
  const createRoom = () => {
    console.log("user has created room!");
  };

  const joinRoom = () => {
    console.log("user has joined room!");
  };

  socket.on("create-room", createRoom());

  socket.on("join-room", joinRoom());
};
