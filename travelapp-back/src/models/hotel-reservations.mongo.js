const mongoose = require('mongoose')

const hotelReservationSchema = new mongoose.Schema({
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        // required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    room_name: {
        type: String,
        required: true
    },
    room_number: {
        type: String,
        required: true
    },
    room_price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('HotelReservation', hotelReservationSchema)