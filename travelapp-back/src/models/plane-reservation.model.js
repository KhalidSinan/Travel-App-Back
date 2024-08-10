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
    // Remove Going
    reservation.reservations.data.pull(person_reservation)
    reservation.reservations.overall_price -= person_reservation.price
    reservation.reservations.overall_price = reservation.reservations.overall_price.toFixed(2);
    reservation.overall_price -= person_reservation.price

    // Remove Coming
    const comingBack = reservation.reservations_back.data.find(res => res.name == person_reservation.name);
    if (comingBack) {
        reservation.reservations_back.data.pull(comingBack)
        reservation.reservations_back.overall_price -= comingBack.price
        reservation.reservations_back.overall_price = reservation.reservations_back.overall_price.toFixed(2);
        reservation.overall_price -= comingBack.price
    }
    // Main
    reservation.num_of_reservations--;
    reservation.overall_price = reservation.overall_price.toFixed(2);
    await reservation.save()
    return reservation.num_of_reservations;
}

async function getAllPlaneReservations() {
    return await PlaneReservation.find()
}

async function deleteReservation(reservation) {
    return await PlaneReservation.deleteOne(reservation)
}

async function getAllReservationsWithFlightData(user_id) {
    return await PlaneReservation.find({ user_id }).populate('flights')
}

async function putReservationData(id, data) {
    const reservation = await PlaneReservation.findById(id)
    reservation.reservations.data = data
    return await reservation.save();
}

async function getAllPlaneReservations(ids) {
    return await PlaneReservation.find({ _id: ids }).populate('flights', '-source._id -destination._id')
    //.select('-reservations._id')
}

async function getPlaneReservationCountForFlight(flight_id) {
    return await PlaneReservation.find({ flights: { $in: flight_id } }).countDocuments()
}

module.exports = {
    postReservation,
    getReservation,
    putConfirmation,
    removeReservation,
    getAllPlaneReservations,
    deleteReservation,
    getAllReservationsWithFlightData,
    putReservationData,
    getAllPlaneReservations,
}