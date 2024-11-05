// routes/chatRouter.js
const express = require('express');
const { ChatRemoteDataSourceImpl } = require('../data_sources/chatRemoteDataSourceImpl'); // Import your data source
const { FirebaseFirestore } = require('firebase-admin/firestore'); // Adjust the import based on your setup

const router = express.Router();
const firestore = new FirebaseFirestore(); // Initialize Firestore (modify as necessary)
const chatRemoteDataSource = new ChatRemoteDataSourceImpl({ fireStore: firestore });

// Send a message
router.post('/sendMessage', async (req, res) => {
    const { chat, message } = req.body;
    try {
        await chatRemoteDataSource.sendMessage(chat, message);
        res.status(200).send({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ error: 'Error sending message' });
    }
});

// Delete a chat
router.delete('/deleteChat/:senderUid/:recipientUid', async (req, res) => {
    const { senderUid, recipientUid } = req.params;
    const chat = { senderUid, recipientUid }; // Adjust as per your ChatEntity structure
    try {
        await chatRemoteDataSource.deleteChat(chat);
        res.status(200).send({ message: 'Chat deleted successfully' });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).send({ error: 'Error deleting chat' });
    }
});

// Delete a message
router.delete('/deleteMessage/:senderUid/:recipientUid/:messageId', async (req, res) => {
    const { senderUid, recipientUid, messageId } = req.params;
    const message = { senderUid, recipientUid, messageId }; // Adjust as per your MessageEntity structure
    try {
        await chatRemoteDataSource.deleteMessage(message);
        res.status(200).send({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).send({ error: 'Error deleting message' });
    }
});

// Get messages
router.get('/messages/:senderUid/:recipientUid', (req, res) => {
    const { senderUid, recipientUid } = req.params;
    const messageEntity = { senderUid, recipientUid }; // Adjust as per your MessageEntity structure
    const messageStream = chatRemoteDataSource.getMessages(messageEntity);
    messageStream.onSnapshot((snapshot) => {
        const messages = snapshot.docs.map(doc => doc.data());
        res.status(200).json(messages);
    });
});

// Get chat
router.get('/myChat/:senderUid', (req, res) => {
    const { senderUid } = req.params;
    const chatEntity = { senderUid }; // Adjust as per your ChatEntity structure
    const chatStream = chatRemoteDataSource.getMyChat(chatEntity);
    chatStream.onSnapshot((snapshot) => {
        const chats = snapshot.docs.map(doc => doc.data());
        res.status(200).json(chats);
    });
});

// Update seen message
router.patch('/seenMessage', async (req, res) => {
    const { message } = req.body; // Ensure the body has message info
    try {
        await chatRemoteDataSource.seenMessageUpdate(message);
        res.status(200).send({ message: 'Message status updated to seen' });
    } catch (error) {
        console.error('Error updating message status:', error);
        res.status(500).send({ error: 'Error updating message status' });
    }
});

module.exports = router;
