const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', default: null },
    reactions: { type: Map, of: Number, default: {} },
    timestamp: { type: Date, default: Date.now },
  });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
