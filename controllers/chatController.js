const Chat = require('../models/ChatModel');
const Message = require('../models/essageModel');
const { v1: uuidv1 } = require('uuid');

// Save a new chat message
exports.sendMessage = async (req, res) => {
  try {
    const { senderUid, recipientUid, senderName, recipientName, createdAt, repliedTo, repliedMessage, isSeen, messageType, message, repliedMessageType } = req.body;

    const messageId = uuidv1();

    const newMessage = new Message({
      senderUid,
      recipientUid,
      senderName,
      recipientName,
      createdAt,
      repliedTo,
      repliedMessage,
      isSeen,
      messageType,
      message,
      messageId,
      repliedMessageType
    });

    const savedMessage = await newMessage.save();

    const recentTextMessage = {
      [MessageTypeConst.photoMessage]: '📷 Photo',
      [MessageTypeConst.videoMessage]: '📸 Video',
      [MessageTypeConst.audioMessage]: '🎵 Audio',
      [MessageTypeConst.gifMessage]: 'GIF'
    }[messageType] || message;

    // Add the message to the chat
    const chatUpdate = {
      createdAt,
      senderProfile: req.body.senderProfile,
      recipientProfile: req.body.recipientProfile,
      recentTextMessage,
      recipientName,
      senderName,
      recipientUid,
      senderUid,
      totalUnReadMessages: req.body.totalUnReadMessages
    };

    const myChat = await Chat.findOneAndUpdate(
      { senderUid, recipientUid },
      { ...chatUpdate },
      { new: true, upsert: true }
    );

    const otherChat = await Chat.findOneAndUpdate(
      { senderUid: recipientUid, recipientUid: senderUid },
      { ...chatUpdate },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, data: savedMessage, chat: { myChat, otherChat } });
  } catch (error) {
    res.status(400).json({ error: 'Error saving message' });
  }
};

// Retrieve chat messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderUid: req.params.user1, recipientUid: req.params.user2 },
        { senderUid: req.params.user2, recipientUid: req.params.user1 },
      ],
    }).sort('createdAt');
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: 'Error retrieving messages' });
  }
};

// Delete chat message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.deleteOne({ messageId: req.body.messageId });
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting message' });
  }
};

// Update message seen status
exports.seenMessageUpdate = async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      { messageId: req.body.messageId },
      { isSeen: req.body.isSeen },
      { new: true }
    );
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ error: 'Error updating message status' });
  }
};
