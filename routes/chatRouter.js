const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Routes for chats
router.post("/", chatController.createChat);
router.get("/:userId", chatController.getUserChats);
router.put("/:chatId", chatController.updateChat);
router.delete("/:chatId", chatController.deleteChat);

module.exports = router;
