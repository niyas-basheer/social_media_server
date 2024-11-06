const mongoose = require("mongoose");

const callSchema = new mongoose.Schema({
  callId: {
    type: String,
    required: true,
    unique: true,
  },
  callerId: {
    type: String,
    required: true,
  },
  callerName: {
    type: String,
  },
  callerProfileUrl: {
    type: String,
  },
  receiverId: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
  },
  receiverProfileUrl: {
    type: String,
  },
  isCallDialed: {
    type: Boolean,
    default: false,
  },
  isMissed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Call", callSchema);
