const mongoose = require('mongoose')

const roomCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    overall_price: {
        type: Number,
        required: true
    },
})

const hotelReservationSchema = new mongoose.Schema({
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    room_codes: {
        type: [roomCodeSchema],
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    room_price: {
        type: Number,
        required: true
    }
})
hotelReservationSchema.index({ hotel_id: 1, room_code: 1, start_date: 1, end_date: 1 });


module.exports = mongoose.model('HotelReservation', hotelReservationSchema)

