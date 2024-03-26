const mongoose = require('mongoose');
const destinationCitySchema = require('./destination-cities.mongo');

const tripDestinationSchema = new mongoose.Schema({
    arrival_date: {
        type: Date,
        required: true,
    },
    country_name: {
        type: String,
        required: true
    },
    flight_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    cities: [destinationCitySchema]
})

module.exports = tripDestinationSchema