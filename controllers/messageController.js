const Message = require("../models/MessageModel");
const Chat = require("../models/ChatModel");
// Send a new message
const sendMessage = async (req, res) => {
  console.log(req.body,'messege log');
    try {
        const messageData = req.body;
        const newMessage = await Message.create(messageData);
        const chat = await Chat.findById(messageData.chat);
        if (chat) {
            chat.messages.push(newMessage._id);
            await chat.save();
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
};

// Get messages for a chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
      
      const chat = await Chat.findById(chatId)
          .populate({
              path: "messages", 
              select: "-__v -updatedAt", 
          })
          .select("messages"); 

      if (!chat) {
          return res.status(404).json({ error: "Chat not found" });
      }

      res.status(200).json(chat.messages);
  } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
  }
};


// Update a message (e.g., mark as seen)
const updateMessage = async (req, res) => {
  console.log(req.body);
  
    const { messageId } = req.body;
    const { isSeen } = req.body; 
    try {
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { isSeen },
            { new: true }
        );
        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Error updating message:", error);
        res.status(500).json({ error: "Failed to update message" });
    }
};

// Delete a message
const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    try {
        await Message.findByIdAndDelete(messageId);
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Failed to delete message" });
    }
};
module.exports = {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage

};