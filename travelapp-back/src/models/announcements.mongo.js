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
}, { timestamps: true })

module.exports = mongoose.model('Announcement', announcementSchema)