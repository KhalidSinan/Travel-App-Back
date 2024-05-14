const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    data: [{
        person_name: {
            type: String,
            required: true,
        },
        seat_class: {
            type: String,
            // enum: ['A', 'B', 'C'],
            required: true
        },
        person_passport: {
            type: String,
            required: true
        },
        seat_number: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    }],
    overall_price: {
        type: Number,
        required: true
    },
})

const planeReservationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    flights: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    }],
    num_of_reservations: {
        type: Number,
        required: true,
    },
    reservations: {
        type: reservationSchema,
        required: true
    },
    reservations_back: {
        type: reservationSchema,
    },
    overall_price: {
        type: Number,
        required: true
    },
    reservation_type: {
        type: String,
        required: true
    },
    is_confirmed: {
        type: Boolean,
        default: false,
        required: true,
    }
}, { timestamps: true })



module.exports = mongoose.model('PlaneReservation', planeReservationSchema)