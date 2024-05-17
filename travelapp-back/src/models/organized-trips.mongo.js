const mongoose = require('mongoose')

const organizedTripSchema = new mongoose.Schema({
    trip_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    available_seats: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    commission: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('OrganizedTrip', organizedTripSchema)