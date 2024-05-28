const OrganizedTripReservations = require('./organized-trip-reservations.mongo')

async function postOrganizedTripReservation(data) {
    return await OrganizedTripReservations.create(data)
}

async function getOrganizedTripReservations(user_id) {
    return await OrganizedTripReservations.find({ user_id })
}

async function getOrganizedTripReservationsForOneTrip(_id) {
    return await OrganizedTripReservations.find({ _id })
}

module.exports = {
    postOrganizedTripReservation,
    getOrganizedTripReservations,
    getOrganizedTripReservationsForOneTrip
}