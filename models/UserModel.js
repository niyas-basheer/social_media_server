const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false, 
  },
  uid: {
    type: String,
    required: true,
    unique: true, 
  },
  status: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
}, {
  timestamps: true, 
});

// Create and export the User model
module.exports = mongoose.model("User", userSchema);
