const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure emails are unique
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false, // Default value for online status
  },
  uid: {
    type: String,
    required: true,
    unique: true, // Ensure UIDs are unique
  },
  status: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

// Create and export the User model
module.exports = mongoose.model("User", userSchema);
