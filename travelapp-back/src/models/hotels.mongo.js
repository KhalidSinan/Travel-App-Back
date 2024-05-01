const mongoose = require('mongoose')
const addressSchema = require('./address.mongo')
const roomTypeSchema = require('./room-types.mongo')

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: addressSchema,
        required: true
    },
    stars: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    room_types: {
        type: [roomTypeSchema],
        required: true,
    },
    rooms_number: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Hotel', hotelSchema)