const mongoose = require('mongoose');

const codeConfirmationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    token: Number
}, { timestamps: true })


module.exports = mongoose.model('CodeConfirmation', codeConfirmationSchema);