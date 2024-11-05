// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.router");
const callRoutes = require("./routes/callRoutes"); 
const chatRoutes = require('./routes/chatRouter');
const statusRoutes = require('./statusRoutes'); 

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("YOUR_MONGODB_CONNECTION_STRING", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Routes
app.use("/api/users", userRoutes);  
app.use("/api/calls", callRoutes); 
app.use("/api/chat", chatRoutes);  
app.use('/api', statusRoutes);     

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
