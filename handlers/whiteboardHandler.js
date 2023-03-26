//Handle create/join/leave room events
const whiteboardHandler = (socket) => {
  //Send screenshot
  const sendScreenshot = (roomId, drawnImage) => {
    socket.to(roomId).emit("transmit-screenshot", drawnImage);
  };
  //Send whiteboard
  const sendWhiteboard = (roomId, sketchedImage) => {
    socket.to(roomId).emit("transmit-whiteboard", sketchedImage);
  };
  //Send clear screenshot
  const sendClear = (roomId) => {
    socket.to(roomId).emit("transmit-clear");
  };
  //Send erase whiteboard
  const sendErase = (roomId) => {
    socket.to(roomId).emit("transmit-erase");
  };

  socket.on("send-screenshot", sendScreenshot);
  socket.on("send-whiteboard", sendWhiteboard);
  socket.on("send-clear", sendClear);
  socket.on("send-erase", sendErase);
};

module.exports = whiteboardHandler;
