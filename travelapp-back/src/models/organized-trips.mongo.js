const mongoose = require('mongoose')

const organizedTripSchema = new mongoose.Schema({
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizer',
        required: true
    },
    trip_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    overall_seats: {
        type: Number,
        required: true
    },
    available_seats: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    commission: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0,
        required: true
    },
    type_of_trip: {
        type: [String],
        required: true,
        enum: ["Entertainment", "Exploratory", "Therapeutic", "Artistic", "Educational"]
    },
    reviews: {
        type: [{
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            stars: {
                type: Number,
                required: true
            }
        }]
    }
}, { timestamps: true })

module.exports = mongoose.model('OrganizedTrip', organizedTripSchema)