const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['Super-Admin', 'Organizers-Admin', 'Reports-Admin', 'Notifications-Admin', 'Announcements-Admin'],
        required: true,
        trim: true,
    },
}, { timestamps: true })

adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
})

adminSchema.methods.checkCredentials = async function (hashed, password) {
    return await bcrypt.compare(password, hashed);
}

module.exports = mongoose.model('Admin', adminSchema)