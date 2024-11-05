const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderUid: {
    type: String,
    required: true,
  },
  recipientUid: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
  },
  recipientName: {
    type: String,
  },
  messageType: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
  repliedTo: {
    type: String,
  },
  repliedMessage: {
    type: String,
  },
  repliedMessageType: {
    type: String,
  },
  messageId: {
    type: String,
    required: true,
  },
});

// Create and export the Message model
module.exports = mongoose.model("Message", messageSchema);
