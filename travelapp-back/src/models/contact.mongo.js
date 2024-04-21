const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    country_code: {
        type: String,
        required: [true, 'Enter Code Number'],
    },
    number: {
        type: String,
        required: [true, 'Enter Phone Number'],
        trim: true,
    }
})

module.exports = contactSchema