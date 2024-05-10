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
    if (reservation.reservations.data.find(res => res._id.equals(person_reservation._id))) {
        reservation.reservations.data.pull(person_reservation)
        reservation.reservations.overall_price -= person_reservation.price
        reservation.reservations.overall_price = reservation.reservations.overall_price.toFixed(2);

    }
    if (reservation.reservations_back.data.find(res => res._id.equals(person_reservation._id))) {
        reservation.reservations_back.data.pull(person_reservation)
        reservation.reservations_back.overall_price -= person_reservation.price
        reservation.reservations_back.overall_price = reservation.reservations_back.overall_price.toFixed(2);
    }
    reservation.num_of_reservations--;
    reservation.overall_price -= person_reservation.price
    reservation.overall_price = reservation.overall_price.toFixed(2);
    await reservation.save()
}

module.exports = {
    postReservation,
    getReservation,
    putConfirmation,
    removeReservation
}