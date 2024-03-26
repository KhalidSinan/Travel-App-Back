const mongoose = require('mongoose');
const addressSchema = require('./address.mongo')
const contactSchema = require('./contact.mongo');
const workTimeSchema = require('./work-time.mongo');

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: addressSchema,
        required: true
    },
    phone_number: contactSchema,
    category: {
        type: String,
        required: true,
    },
    work_time: {
        type: workTimeSchema,
        required: true,
    },
    description: {
        type: String,
    }
})

module.exports = mongoose.model('Place', placeSchema)