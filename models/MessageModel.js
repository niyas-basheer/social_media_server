const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  senderUid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  recipientUid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  senderName: {
    type: String,
    trim: true
  },
  recipientName: {
    type: String,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'file'],
    default: 'text'
  },
  message: {
    type: String,
    required: true,
    trim: true
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
  fileUrl: {
    type: String,
    trim: true
  },
  messageId: {
    type: String,
    required: true,
    unique: true
  },
}, { timestamps: true });

// Create and export the Message model
module.exports = model("Message", messageSchema);
