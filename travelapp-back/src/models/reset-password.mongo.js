const mongoose = require('mongoose');

const resetPasswordSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    token: String
}, { timestamps: true })


module.exports = mongoose.model('ResetPassword', resetPasswordSchema);