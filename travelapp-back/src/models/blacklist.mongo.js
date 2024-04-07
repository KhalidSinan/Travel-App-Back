const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token_blacklisted: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})


module.exports = mongoose.model('Blacklist', blacklistSchema)