const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(verifyToken, allMessages);
router.route("/").post(verifyToken, sendMessage);

module.exports = router;
