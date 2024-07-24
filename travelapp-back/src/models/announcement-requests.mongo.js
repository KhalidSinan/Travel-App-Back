const mongoose = require('mongoose')

const announcementRequestSchema = new mongoose.Schema({
    announcement_title: {
        type: String,
        required: true
    },
    announcement_body: {
        type: String,
        required: true
    },
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizer'
    },
    organized_trip_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizedTrip'
    },
    is_accepted: {
        type: Boolean,
    }
}, { timestamps: true })

module.exports = mongoose.model('AnnouncementRequest', announcementRequestSchema)