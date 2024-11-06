// socket.js
const clients = new Map();

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("signin", (id) => {
      clients.set(id, socket);
      console.log(`User ${id} signed in.`);
    });

    socket.on("message", (msg) => {
      const targetId = msg.targetId;
      if (clients.has(targetId)) {
        clients.get(targetId).emit("message", msg);
      } else {
        console.log(`User ${targetId} not found or offline.`);
      }
    });

    socket.on("disconnect", () => {
      for (const [id, clientSocket] of clients) {
        if (clientSocket === socket) {
          clients.delete(id);
          console.log(`User ${id} disconnected.`);
          break;
        }
      }
    });
  });
}

module.exports = initializeSocket;
