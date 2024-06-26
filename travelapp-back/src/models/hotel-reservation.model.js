const HotelReservation = require("./hotel-reservation.mongo")

async function postReservation(data) {
    const newReservation = new HotelReservation(data);
    return await newReservation.save();
}

async function getHotelReservation(id) {
    return await HotelReservation.findById(id);
}


module.exports = {
    postReservation,
    getHotelReservation
}

