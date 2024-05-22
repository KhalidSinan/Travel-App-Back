const mongoose = require('mongoose')
const destinationSchema = require('./destination.mongo')
const roomTypeSchema = require('./room-types.mongo')

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: destinationSchema,
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
    },
    distance_from_city_center: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    }
})
hotelSchema.index({ 'name': 1, 'location.city': 1 });


module.exports = mongoose.model('Hotel', hotelSchema)



