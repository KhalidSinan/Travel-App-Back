const mongoose = require('mongoose');
const tripDestinationSchema = require('./trip-destinations.mongo');

const tripSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    overall_num_of_days: {
        type: Number,
        required: true
    },
    num_of_people: {
        type: Number,
        required: true,
    },
    overall_price: {
        type: Number,
        required: true,
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true,
    },
    starting_place: {
        type: String,
        required: true,
    },
    destinations: [{
        destination: {
            type: tripDestinationSchema,
            required: true,
        },
        num_of_days: {
            type: Number,
            required: true,
        }
    }],
    flights: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true,
    }],
    hotels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true,
    }],
    places_to_visit: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true,
    }],
});

module.exports = mongoose.model('Trip', tripSchema);
