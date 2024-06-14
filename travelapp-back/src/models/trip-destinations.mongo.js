const mongoose = require('mongoose');
const destinationCitySchema = require('./destination-cities.mongo');

const tripDestinationSchema = new mongoose.Schema({
    country_name: {
        type: String,
        required: true
    },
    cities: [destinationCitySchema]
})

module.exports = tripDestinationSchema;
