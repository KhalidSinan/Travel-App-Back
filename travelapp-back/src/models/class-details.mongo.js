const mongoose = require('mongoose')

const classDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true
    },
    available_seats: {
        type: Number,
        required: true
    },
    features: {
        type: [String],
        required: true
    },
})

module.exports = classDetailSchema