const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    notification_title: {
        type: String,
        required: true
    },
    notification_body: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)