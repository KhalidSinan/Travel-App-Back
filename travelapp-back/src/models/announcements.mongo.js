const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
    announcement_title: {
        type: String,
        required: true
    },
    announcement_body: {
        type: String,
        required: true
    },
    from_organizer: {
        type: Boolean,
        required: true,
        default: false
    },
    organized_trip_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizedTrip'
    },
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizer'
    },
    expiry_date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    location: {
        type: String,
        enum: ['Home', 'Organized'],
    },
    price: {
        type: Number,
    }
}, { timestamps: true })

module.exports = mongoose.model('Announcement', announcementSchema)