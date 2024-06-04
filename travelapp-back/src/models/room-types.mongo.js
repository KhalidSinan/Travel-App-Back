const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        reequired: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    bed_options: {
        type: String,
        required: true
    },
    sleeps_count: {
        type: Number,
        required: true
    },
    smoking_allowed: {
        type: Boolean,
        required: true
    },
    available_rooms: {
        type: Number,
        required: true
    },
    total_rooms: {
        type: Number,
        required: true
    },
    view: {
        type: String,
        required: true
    },
    amenities: {
        type: [String],
        required: true
    },
    images: {
        type: [String],
        required: true
    }
});

module.exports = roomTypeSchema;
