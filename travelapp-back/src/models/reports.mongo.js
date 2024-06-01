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
}, { timestamps: true })

module.exports = mongoose.model('Report', reportSchema)