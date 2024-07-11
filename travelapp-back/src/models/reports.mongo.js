const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    report_title: {
        type: String,
        required: true
    },
    report_message: {
        type: String,
        required: true
    },
    on_organizer: {
        type: Boolean,
        required: true,
        default: false
    },
    organizer_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    }
}, { timestamps: true })

module.exports = mongoose.model('Report', reportSchema)