const mongoose = require('mongoose');
const tripDestinationSchema = require('./trip-destinations.mongo');
const destinationCitySchema = require('./destination-cities.mongo');

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
    price_per_person: {
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
        type: {
            country: String,
            city: String,
        },
        required: true,
    },
    destinations: {
        type: [destinationCitySchema],
        required: true
    },
    flights: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlaneReservation',
        required: true,
    }],
    hotels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HotelReservation',
        required: true,
    }],
    places_to_visit: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true,
    }],
    is_shared: {
        type: Boolean,
        required: true,
        default: false
    },
    is_canceled: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Trip', tripSchema);
