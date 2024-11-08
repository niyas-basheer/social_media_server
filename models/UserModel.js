const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
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
  status: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
}, {
  timestamps: true, 
});


module.exports = mongoose.model("User", userSchema);
