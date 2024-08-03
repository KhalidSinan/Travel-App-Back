const mongoose = require('mongoose');

const destinationCitySchema = new mongoose.Schema({
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
        description: {
            type: String,
        },
        notifiable: {
            type: Boolean,
            required: true,
            default: false
        }
    }]
})

module.exports = destinationCitySchema;
