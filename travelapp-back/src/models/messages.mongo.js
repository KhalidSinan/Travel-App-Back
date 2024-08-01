const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: String,
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    timestamp: { type: Date, default: new Date() }
})

module.exports = messageSchema