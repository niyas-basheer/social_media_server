const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
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
  recentTextMessage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  senderProfile: {
    type: String,
  },
  recipientProfile: {
    type: String,
  },
  totalUnReadMessages: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
