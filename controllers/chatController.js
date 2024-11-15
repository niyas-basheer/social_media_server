const Chat = require('../models/ChatModel');
const Message = require('../models/MessageModel');

// Save a new chat message
exports.saveMessage = async (req, res) => {
  try {
    const newMessage = new Message({
      senderUid: req.body.senderUid,
      recipientUid: req.body.recipientUid,
      senderName: req.body.senderName,
      recipientName: req.body.recipientName,
      createdAt: req.body.createdAt,
      message: req.body.message,
      messageType: req.body.messageType,
      repliedTo: req.body.repliedTo,
      repliedMessage: req.body.repliedMessage,
      isSeen: req.body.isSeen,
      messageId: req.body.messageId,
      repliedMessageType: req.body.repliedMessageType,
    });

    const savedMessage = await newMessage.save();

    // Add the message to the chat
    const chat = await Chat.findOneAndUpdate(
      { senderUid: req.body.senderUid, recipientUid: req.body.recipientUid },
      { recentTextMessage: req.body.message, createdAt: new Date() },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, data: savedMessage, chat });
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
