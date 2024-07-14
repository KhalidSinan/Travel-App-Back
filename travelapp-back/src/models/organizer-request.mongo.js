const mongoose = require('mongoose')
const { proofSchema } = require('./proofs.mongo')

const organizerRequestSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    years_of_experience: {
        type: Number,
        required: true
    },
    proofs: {
        type: proofSchema,
        required: true
    },
    is_accepted: {
        type: Boolean,
    }
}, { timestamps: true })

module.exports = mongoose.model('OrganizerRequest', organizerRequestSchema)