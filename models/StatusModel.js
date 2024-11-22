const mongoose = require("mongoose");

const statusImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
}, { _id: false });

const statusSchema = new mongoose.Schema({
  statusId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  uid: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  profileUrl: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  caption: {
    type: String,
    trim: true,
  },
  stories: [statusImageSchema], 
}, {
  timestamps: true,
  versionKey: false,
});

// Create and export the Status model
module.exports = mongoose.model("Status", statusSchema);
