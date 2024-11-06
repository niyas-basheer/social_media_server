require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const dbconnect=require("./config/db");

const app = express();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5001", "https://your-production-domain.com"],
    methods: ["GET", "POST"]
  }
});
dbconnect()
// Middleware
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => res.status(200).json({ status: "Server is running" }));

// Routes
const messageRoutes = require('./routes/massegeRoutes');
const callRoutes = require('./routes/callRoutes');
const chatRoutes = require('./routes/chatRouter');
const statusRoutes = require('./routes/statuesRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/messages', messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/statues", statusRoutes);

// Import and initialize socket
const initializeSocket = require('./sockets/socket');
initializeSocket(io);

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling
process.on("uncaughtException", (err) => console.error("Uncaught Exception:", err));
process.on("unhandledRejection", (reason, promise) => console.error("Unhandled Rejection:", reason));
