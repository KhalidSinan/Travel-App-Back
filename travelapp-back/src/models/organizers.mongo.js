const mongoose = require('mongoose');
const { proofSchema } = require('./proofs.mongo');

const organizerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    years_of_experience: {
        type: Number,
        required: true,
        default: 0
    },
    num_of_trips: {
        type: Number,
        required: true,
        default: 0
    },
    num_of_reports: {
        type: Number,
        required: true,
        default: 0
    },
    num_of_warnings: {
        type: Number,
        required: true,
        default: 0
    },
    proofs: {
        type: proofSchema,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model('Organizer', organizerSchema);