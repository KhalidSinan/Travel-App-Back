const mongoose = require('mongoose');

const destinationCitySchema = new mongoose.Schema({
    city_name: {
        type: String,
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true,
    },
    num_of_days: {
        type: Number,
        required: true
    },
    activities: [{
        place: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Place',
            required: true,
        },
        description: {
            type: String,
        }
    }]
})

module.exports = destinationCitySchema;
