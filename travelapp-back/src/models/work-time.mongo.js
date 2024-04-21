const mongoose = require('mongoose');

const workTimeSchema = new mongoose.Schema({
    start: {
        hour: {
            type: Number,
            required: true,
        },
        minute: {
            type: Number,
            required: true,
        },
    },
    end: {
        hour: {
            type: Number,
            required: true,
        },
        minute: {
            type: Number,
            required: true,
        },
    },
})

module.exports = workTimeSchema