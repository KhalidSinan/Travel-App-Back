const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: String,
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    timestamp: { type: Date, default: Date.now }
})

module.exports = messageSchema