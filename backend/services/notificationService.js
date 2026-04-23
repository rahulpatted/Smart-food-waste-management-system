const logger = require("../utils/logger");
let io;

exports.initSocket = (server) => {
  const socketIo = require("socket.io");
  io = socketIo(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    logger.info("📡 Real-time Client Connected");

    // Allow clients to join rooms based on their roles (e.g., 'ngo')
    socket.on("join", (role) => {
      if (role) {
        socket.join(role);
        logger.info(`👥 Client joined room: ${role}`);
      }
    });

    socket.on("disconnect", () => {
      logger.info("📡 Client Disconnected");
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
