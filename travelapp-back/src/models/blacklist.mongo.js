const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token_blacklisted: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'user_type'
    },
    user_type: {
        type: String,
        required: true,
        enum: ['User', 'Admin']
    }
})


module.exports = mongoose.model('Blacklist', blacklistSchema)