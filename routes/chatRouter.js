const express = require('express');
const { createChat, getChats, deleteChat } = require('../controllers/chatController');

const router = express.Router();

router.post('/', createChat);
router.get('/:userId', getChats);
router.delete('/:chatId', deleteChat);

module.exports = router;
