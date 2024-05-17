const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
    data: [{
        person_name: {
            type: String,
            required: true,
        },
        seat_class: {
            type: String,
            // enum: ['A', 'B', 'C'],
            required: true
        },
        person_passport: {
            type: String,
            required: true
        },
        seat_number: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    }],
    overall_price: {
        type: Number,
        required: true
    },
})

module.exports = reservationSchema