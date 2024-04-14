const PlaneReservation = require('./plane-reservation.mongo')

async function postReservation(data) {
    return await PlaneReservation.create(data)
}

async function getReservation(id) {
    return await PlaneReservation.findById(id).populate('flight_id', '-source._id -destination._id').select('-reservations._id')
}

async function putConfirmation(reservation, data) {
    reservation.is_confirmed = data;
    return await reservation.save();
}

module.exports = {
    postReservation,
    getReservation,
    putConfirmation,
}