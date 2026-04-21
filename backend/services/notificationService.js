let io;

exports.initSocket = (server) => {
  const socketIo = require("socket.io");
  io = socketIo(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("Client connected");

    // Allow clients to join rooms based on their roles (e.g., 'ngo')
    socket.on("join", (role) => {
      if (role) {
        socket.join(role);
        console.log(`Client joined room: ${role}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

exports.sendAlert = (message, room = null) => {
  if (io) {
    if (room) {
      io.to(room).emit("alert", message);
    } else {
      io.emit("alert", message);
    }
  }
};