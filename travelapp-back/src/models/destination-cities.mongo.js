const mongoose = require('mongoose')

const destinationCitySchema = new mongoose.Schema({
    city_name: {
        type: String,
        required: true
    },
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    num_of_days: {
        type: Number,
        required: true
    },
    days: [{
        activities: [String]
    }]
})

module.exports = destinationCitySchema