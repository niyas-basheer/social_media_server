const mongoose = require("mongoose");

// Define the StatusImage schema for stories
const statusImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  // Add any additional fields for status images here
});

// Define the main Status schema
const statusSchema = new mongoose.Schema({
  statusId: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
  },
  uid: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  profileUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phoneNumber: {
    type: String,
  },
  caption: {
    type: String,
  },
  stories: [statusImageSchema], // Array of status images
});

// Create and export the Status model
module.exports = mongoose.model("Status", statusSchema);
