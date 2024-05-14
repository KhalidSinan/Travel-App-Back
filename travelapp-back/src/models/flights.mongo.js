const mongoose = require('mongoose');
const tripDestinationSchema = require('./destination.mongo');
const classDetailSchema = require('./class-details.mongo');

const dateSchema = new mongoose.Schema({
    dateTime: Date,
    date: String,
    time: String
})

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
        type: {
            name: {
                type: String,
                required: true
            },
            logo: {
                type: String,
                required: true
            }
        },
        required: true
    },
    available_seats: {
        type: Number,
        required: true
    },
    departure_date: {
        type: dateSchema,
        required: true
    },
    arrival_date: {
        type: dateSchema,
        required: true
    },
    classes: {
        type: [classDetailSchema],
        required: true
    }
})


module.exports = mongoose.model('Flight', flightSchema);