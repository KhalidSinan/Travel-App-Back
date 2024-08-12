const mongoose = require('mongoose');

const destinationCitySchema = new mongoose.Schema({
    country_name: {
        type: String,
        required: true
    },
    city_name: {
        type: String,
        required: true
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
        notifiable: {
            type: Boolean,
            required: true,
            default: false
        },
        day: {
            type: Number,
            required: true,
            default: 1
        }
    }]
})

module.exports = destinationCitySchema;
