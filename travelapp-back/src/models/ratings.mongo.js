const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    }
}, { timestamps: true })

module.exports = mongoose.model('Rating', ratingSchema)