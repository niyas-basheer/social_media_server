const Message = require('../models/MessageModel');
const Chat = require('../models/ChatModel');

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    
    await Chat.findByIdAndUpdate(req.body.chatId, {
      recentMessage: req.body.text,
      updatedAt: new Date()
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a chat
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.messageId);
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
