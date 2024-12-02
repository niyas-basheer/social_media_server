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
    enum: ['individual', 'group'], 
    required: true
  },
  senderUid: {
    type:mongoose.Schema.Types.ObjectId,
    required: function () {
      return this.type === 'individual'; 
    },
  },
  recipientUid: {
    type: mongoose.Schema.Types.ObjectId,
    required: function () {
      return this.type === 'individual'; 
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
      default:[]
    }
  ],
},{ timestamps: true });



module.exports = mongoose.model("Chat", chatSchema);
