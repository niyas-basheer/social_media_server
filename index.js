require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const logger = require("morgan");
const dbconnect = require("./config/db");

// Routes
const messageRoutes = require("./routes/massegeRoutes");
const callRoutes = require("./routes/callRoutes");
const chatRoutes = require("./routes/chatRouter");
const statusRoutes = require("./routes/statuesRoutes");
const userRoutes = require("./routes/userRoutes");

const initializeSocket = require("./sockets/socket");

const app = express();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    // origin: ["http://localhost:5001"],
    origin: "*",
    methods: ["GET", "POST"],
  },
});

(async () => {
  try {
    await dbconnect();
    initializeSocket(io);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
})();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(logger("dev")); 

app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/statues", statusRoutes);

// Public Api for accessing images
app.use("/api/img", express.static(__dirname + "/public/profile/"));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});