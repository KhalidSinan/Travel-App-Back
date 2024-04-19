const mongoose = require('mongoose');
const tripDestinationSchema = require('./destination.mongo');
const classDetailSchema = require('./class-details.mongo');

const flightSchema = new mongoose.Schema({
    source: {
        type: tripDestinationSchema,
        required: true,
    },
    destination: {
        type: tripDestinationSchema,
        required: true,
    },
    duration: {
        type: Number,
        required: true
    },
    airline: {
        name: {
            type: String,
            required: true
        },
        logo: {
            type: String,
            required: true
        }
    },
    available_seats: {
        type: Number,
        required: true
    },
    departure_date: {
        date: String,
        time: String
    },
    arrival_date: {
        date: String,
        time: String
    },
    classes: {
        type: [classDetailSchema],
        required: true
    }
})


module.exports = mongoose.model('Flight', flightSchema);