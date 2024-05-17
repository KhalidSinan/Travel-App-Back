const mongoose = require('mongoose');

const tripReservationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    trip_id: { // Organized Trip
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizedTrip',
        required: true,
    },
    overall_price: {
        type: Number,
        required: true
    },
}, { timestamps: true })


module.exports = mongoose.model('TripReservation', tripReservationSchema)