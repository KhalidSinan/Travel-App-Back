const mongoose = require('mongoose');

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
    // papers_pdfs: 

}, { timestamps: true })

module.exports = mongoose.model('Organizer', organizerSchema);