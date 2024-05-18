const HotelReservation = require("./hotel-reservations.mongo")

async function postReservation(data) {
    const newReservation = new HotelReservation(data);
    return await newReservation.save();
}


module.exports = {
    postReservation
}

