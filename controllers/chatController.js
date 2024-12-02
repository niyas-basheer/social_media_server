const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");

// Create a new chat
const createChat = async (req, res) => {
    try {
      console.log(req.bodyh);
      
        const chatData = req.body;
        const newChat = await Chat.create(chatData);
        res.status(201).json(newChat);
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ error: "Failed to create chat" });
    }
};

const getUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
      const chats = await Chat.find({
          participants: userId
      })
      .populate({
          path: "participants",
          select: "_id name", // Populate participant IDs and names (optional)
      })
      .populate({
          path: "messages",
          select: "_id", // Only retrieve message IDs
      });

      // Transform the response to include only the array of message IDs
      const transformedChats = chats.map(chat => ({
          ...chat._doc, // Retain other chat properties
          messages: chat.messages.map(message => message._id) // Extract only the message IDs
      }));

      res.status(200).json(transformedChats);
  } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ error: "Failed to fetch chats" });
  }
};


const updateChat = async (req, res) => {
    const { chatId } = req.params;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedChat);
    } catch (error) {
        console.error("Error updating chat:", error);
        res.status(500).json({ error: "Failed to update chat" });
    }
};

// Delete a chat
const deleteChat = async (req, res) => {
    const { chatId } = req.params;
    try {
        await Chat.findByIdAndDelete(chatId);
        res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ error: "Failed to delete chat" });
    }
};
module.exports = {
 createChat,
 getUserChats,
 updateChat,
 deleteChat
};