const mongoose = require('mongoose');
const messageSchema = require('./messages.mongo');

const chatSchema = new mongoose.Schema({
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    trip_id: { // Organized Trip
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    users_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    name: {
        type: String,
        required: true
    },
    messages: [messageSchema],
}, { timestamps: true })


module.exports = mongoose.model('Chat', chatSchema)