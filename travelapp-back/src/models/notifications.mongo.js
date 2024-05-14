const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notification_title: {
        type: String,
        required: true
    },
    notification_body: {
        type: String,
        required: true
    },
    notification_identifier: {
        type: String,
        required: true,
        default: ''
    },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)