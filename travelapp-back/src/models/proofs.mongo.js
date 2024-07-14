const mongoose = require('mongoose');

const proofSchema = new mongoose.Schema({
    personal_id: {
        type: String,
        required: true
    },
    personal_picture: {
        type: String,
        required: true
    },
    work_id: {
        type: String,
        required: true
    },
    last_certificate: {
        type: String,
        required: true
    },
    companies_worked_for: {
        type: [String],
        required: true
    },
})

module.exports = { proofSchema }