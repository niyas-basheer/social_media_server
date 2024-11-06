const Chat = require('../models/ChatModel');

// Create a new chat
exports.createChat = async (req, res) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chats for a user
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.params.userId });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a chat
exports.deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.chatId);
    res.status(200).json({ message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
