const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// Routes for messages
router.post("/", messageController.sendMessage);
router.get("/:chatId", messageController.getMessages);
router.put("/:messageId", messageController.updateMessage);
router.delete("/:messageId", messageController.deleteMessage);

module.exports = router;
