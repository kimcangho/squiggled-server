const { v4: uuidV4 } = require("uuid");

//Store existing rooms server-side
//To-do: store in database
const roomsArr = {};

//Handle create/join/leave room events
const roomHandler = (socket) => {
  const createRoom = (name) => {
    const roomId = uuidV4(); //Generate random id
    roomsArr[roomId] = []; //Create room key with empty array value
    socket.join(roomId); //User joins room
    socket.emit("room-created", { roomId }); //Emit to client
    console.log("user has created room!");
  };

  const joinRoom = ({ roomId, peerId }) => {
    //Cap room size at 2 participants
    if (roomsArr[roomId].length >= 2) {
      socket.emit("room-full", roomId);
    }

    //Check if room exists
    if (roomsArr[roomId]) {
      console.log(`user ${peerId} has joined room ${roomId}`);

      roomsArr[roomId].push(peerId); //Add peer to room
      socket.join(roomId); //User joins room
      socket.to(roomId).emit("user-joined", { peerId, roomId }); //Emit event to other users in room

      //Send back roomId and its array of participants
      socket.emit("get-users", {
        roomId,
        participants: roomsArr[roomId],
      });
    }

    socket.on("disconnect", () => {
      console.log(`user ${peerId} has left the room`);
    });
  };

  const leaveRoom = ({ roomId, peerId }) => {
    roomsArr[roomId] = roomsArr[roomId].filter((id) => id !== peerId); //Filter out peer that leaves
    socket.to(roomId).emit("user-disconnected", peerId); //emit to all others in room
  };

  const emptyRoom = (roomId) => {
    socket.to(roomId).emit("empty-room");
  };

  //Socket Room Listeners
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("leave-room", leaveRoom);
  socket.on("empty-room", emptyRoom);
};

module.exports = roomHandler;
