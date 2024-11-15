const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/messages', chatController.sendMessage);
router.get('/messages/:user1/:user2', chatController.getMessages);
router.delete('/messages', chatController.deleteMessage);
router.put('/messages/update', chatController.seenMessageUpdate);

module.exports = router;
