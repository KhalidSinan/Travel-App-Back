const mongoose = require('mongoose');
const tripDestinationSchema = require('./trip-destinations.mongo');

const tripSchema = new mongoose.Schema({
    overall_num_of_days: {
        type: Number,
        required: true
    },
    overall_price: {
        type: Number,
        required: true
    },
    destinations: [tripDestinationSchema],
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Trip', tripSchema)