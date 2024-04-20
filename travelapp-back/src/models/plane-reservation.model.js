const PlaneReservation = require('./plane-reservation.mongo')

async function postReservation(data) {
    return await PlaneReservation.create(data)
}

async function getReservation(id) {
    return await PlaneReservation.findById(id).populate('flights', '-source._id -destination._id')
    //.select('-reservations._id')
}

async function putConfirmation(reservation, data) {
    reservation.is_confirmed = data;
    return await reservation.save();
}

async function removeReservation(reservation, person_reservation) {
    reservation.reservations.pull(person_reservation)
    await reservation.save()
}

module.exports = {
    postReservation,
    getReservation,
    putConfirmation,
    removeReservation
}