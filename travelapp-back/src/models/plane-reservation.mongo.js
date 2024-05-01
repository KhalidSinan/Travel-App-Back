const mongoose = require('mongoose');

const planeReservationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    flights: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
    }],
    num_of_reservations: {
        type: Number,
        required: true,
    },
    reservations: {
        data: [{
            person_name: {
                type: String,
                required: true,
            },
            seat_class: {
                type: String,
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
    },
    reservations_back: {
        data: [{
            person_name: {
                type: String,
                required: true,
            },
            seat_class: {
                type: String,
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
        },
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
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('PlaneReservation', planeReservationSchema)