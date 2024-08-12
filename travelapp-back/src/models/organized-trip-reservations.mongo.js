const mongoose = require('mongoose');

const reservationDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    passport_number: {
        type: Number,
        required: true,
        minLength: 6,
        maxLength: 9
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
})

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
    num_of_people: {
        type: Number,
        required: true
    },
    reservation_data: {
        type: [reservationDataSchema],
        required: true
    }
}, { timestamps: true })


module.exports = mongoose.model('TripReservation', tripReservationSchema)