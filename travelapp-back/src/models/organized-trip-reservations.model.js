const OrganizedTripReservations = require('./organized-trip-reservations.mongo')

async function postReservation(data) {
    return await OrganizedTripReservations.create(data)
}

async function getReservations(user_id) {
    return await OrganizedTripReservations.find({ user_id })
}

async function getReservationsForTrip(_id) {
    return await OrganizedTripReservations.find({ _id })
}

module.exports = {
    postReservation,
    getReservations,
    getReservationsForTrip
}