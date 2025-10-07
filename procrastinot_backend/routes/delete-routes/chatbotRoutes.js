//routes/delete-routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();
const ChatMessage = require("../../models/ChatMessage");

// ✅ Delete all chat history for a user
router.delete("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user can only delete their own chat history
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own chat history." });
    }

    const result = await ChatMessage.deleteMany({ userId });
    
    res.status(200).json({ 
      message: "Chat history deleted successfully.",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete chat history." });
  }
});

// ✅ Delete a specific chat message
router.delete("/message/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found." });
    }

    // Verify user can only delete their own messages
    if (message.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own messages." });
    }

    await ChatMessage.findByIdAndDelete(messageId);
    
    res.status(200).json({ message: "Message deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message." });
  }
});

module.exports = router;
