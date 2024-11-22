const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  ],
  type: {
    type: String,
    enum: ['individual', 'group'], // Determines if it's an individual or group chat
    required: true,
  },
  senderUid: {
    type:mongoose.Schema.Types.ObjectId,
    required: function () {
      return this.type === 'individual'; // Required only for individual chats
    },
  },
  recipientUid: {
    type: mongoose.Schema.Types.ObjectId,
    required: function () {
      return this.type === 'individual'; // Required only for individual chats
    },
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
  groupName: {
    type: String,
    required: function () {
      return this.type === 'group'; 
    },
  },
  groupDescription: {
    type: String,
  },
  groupIcon: {
    type: String,
  },
  groupAdmins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    }
  ],
});


module.exports = mongoose.model("Chat", chatSchema);
