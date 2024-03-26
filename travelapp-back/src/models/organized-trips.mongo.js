const mongoose = require('mongoose')

const organizedTripSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    trip_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
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