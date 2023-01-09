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

    //Set as host if room is empty
    if (roomsArr[roomId].length === 0) {
      console.log("creating host " + name);
      // console.log(name);
      socket.emit("assign-host");
    }

    socket.emit("room-created", { roomId }); //Emit to client
    console.log("user has created room!");
  };

  const joinRoom = ({ roomId, peerId }) => {
    //Cap room size at 2 participants
    if (roomsArr[roomId].length >= 2) {
      console.log("cruckets");
      socket.emit("room-full", roomId);
    }

    //Check if room exists
    if (roomsArr[roomId]) {
      console.log(`user ${peerId} has joined room ${roomId}`);

      roomsArr[roomId].push(peerId); //Add peer to room
      socket.join(roomId); //User joins room
      socket.to(roomId).emit("user-joined", { peerId }); //Emit event to other users in room

      //Send back roomId and its array of participants
      socket.emit("get-users", {
        roomId,
        participants: roomsArr[roomId],
      });
    }

    socket.on("disconnect", () => {
      console.log(`user ${peerId} has left the room`);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }) => {
    roomsArr[roomId] = roomsArr[roomId].filter((id) => id !== peerId); //Filter out peer that leaves
    socket.to(roomId).emit("user-disconnected", peerId); //emit to all others in room
  };

  //Socket Room Listeners
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("leave-room", leaveRoom);

  //Send screenshot
  socket.on("send-screenshot", (roomId, drawnImage) => {
    console.log(drawnImage);
    console.log("roomId: " + roomId);
    socket.to(roomId).emit("transmit-screenshot", drawnImage);
  });

  //Send whiteboard
  socket.on("send-whiteboard", (roomId, sketchedImage) => {
    console.log(sketchedImage);
    socket.to(roomId).emit("transmit-whiteboard", sketchedImage);
  });

  //Send erase
  socket.on("send-erase", (roomId) => {
    console.log('erasies')
    socket.to(roomId).emit('transmit-erase');
  })

  //Send clear
  socket.on("send-clear", (roomId) => {
    console.log('clearance')
    socket.to(roomId).emit('transmit-clear');
  })
};

module.exports = roomHandler;
