const HotelReservation = require("./hotel-reservation.mongo")

async function postReservation(data) {
    const newReservation = new HotelReservation(data);
    return await newReservation.save();
}

async function getHotelReservation(id) {
    return await HotelReservation.findById(id);
}

async function getHotelReservationsWithDetails(ids) {
    return await HotelReservation.find({ _id: ids }).populate('hotel_id', '-location._id');
}

module.exports = {
    postReservation,
    getHotelReservation,
    getHotelReservationsWithDetails
}

