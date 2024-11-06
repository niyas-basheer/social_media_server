require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://your-production-domain.com"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => res.status(200).json({ status: "Server is running" }));

// Routes
const messageRoutes = require('./routes/massegeRoutes');
const callRoutes =require('./routes/callRoutes');
const chatRoutes  =require('./routes/chatRouter');
const statusRoutes=require('./routes/statuesRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/messages', messageRoutes);
app.use("/api/users", userRoutes);  
app.use("/api/calls", callRoutes); 
app.use("/api/chat",chatRoutes);  
app.use("/api/statues",statusRoutes);  





// Map to track connected clients
const clients = new Map();

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

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Error handling
process.on("uncaughtException", (err) => console.error("Uncaught Exception:", err));
process.on("unhandledRejection", (reason, promise) => console.error("Unhandled Rejection:", reason));
