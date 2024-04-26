const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    bed_options: {
        type: String,
        required: true,
    },
    sleeps_count: {
        type: Number,
        required: true,
    },
    smoking_allowed: {
        type: Boolean,
        required: true,
    },
    available_rooms: {
        type: Number,
        required: true,
    },
    tags: [String]
})

module.exports = roomTypeSchema