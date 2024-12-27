const Chat = require('../models/chat.model');

const postChats = (async (req, res) => {
    const userId = req.id;
    const { receiver, message, replyTo } = req.body;

    try {

        let repliedMessage = null;
        if (replyTo) {
            repliedMessage = await Chat.findById(replyTo);
            if (!repliedMessage) {
                return res.status(404).json({ error: "Original message for reply not found" });
            }
        }

        const chat = new Chat({
            sender: userId,
            receiver,
            message,
            replyTo: repliedMessage ? repliedMessage._id : null,
        })

        await chat.save()

        const savedMessage = await Chat.findById(chat._id).populate('replyTo', 'message');

        res.status(200).json({ savedMessage })
    } catch (error) {
        console.log(error);
    }
})

const getMessages = (async (req, res) => {
    const userId = req.id;
    const { selectedUserId } = req.params

    try {
        const chats = await Chat
            .find({ $or: [{ sender: userId, receiver: selectedUserId }, { sender: selectedUserId, receiver: userId }] })
            .sort({ timestamp: 1 })
            .populate('replyTo', 'message')

        chats.forEach((chat) => {
            if (chat.reactions && typeof chat.reactions.entries === "function") {
                chat.reactions = Object.fromEntries(chat.reactions);
            } else {
                chat.reactions = {}; // Initialize as empty object if invalid
            }
        })

        res.status(200).json(chats)
    } catch (error) {
        console.log(error)
    }
})

// React to a message
const postReaction = ( async (req, res) => {
    const { messageId, emoji } = req.body;
    try {
      const message = await Chat.findById(messageId);
      if (!message) return res.status(404).json({ error: "Message not found" });
  
      // Toggle reaction
      const reactions = message.reactions;
      if (reactions.has(emoji)) {
        // If emoji is already there, remove it
        reactions.set(emoji, reactions.get(emoji) - 1);
        if (reactions.get(emoji) <= 0) reactions.delete(emoji);
      } else {
        // If emoji is not there, add it
        reactions.set(emoji, 1);
      }
      await message.save();
  
      res.status(200).json({ reactions: message.reactions });
    } catch (err) {
      console.error("Error adding reaction:", err);
      res.status(500).json({ error: "Error adding reaction" });
    }
  });

  
const deleteChat = (async (req, res) => {
    const { id } = req.params;
    try {
        await Chat.findByIdAndDelete(id);
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting message", error });
    }
});

module.exports = {
    postChats,
    getMessages,
    postReaction,
    deleteChat
}