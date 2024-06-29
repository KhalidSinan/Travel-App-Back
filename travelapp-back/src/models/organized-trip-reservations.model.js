const OrganizedTripReservations = require('./organized-trip-reservations.mongo')

async function postOrganizedTripReservation(data) {
    return await OrganizedTripReservations.create(data)
}

async function getOrganizedTripReservationsForUser(user_id) {
    return await OrganizedTripReservations.find({ user_id })
}

async function getOrganizedTripReservationsForUserInTrip(user_id, trip_id) {
    return await OrganizedTripReservations.find({ user_id, _id: trip_id })
}

async function getOrganizedTripReservationsForOneTrip(id) {
    return await OrganizedTripReservations.find({ trip_id: id })
}

module.exports = {
    postOrganizedTripReservation,
    getOrganizedTripReservationsForUser,
    getOrganizedTripReservationsForOneTrip,
    getOrganizedTripReservationsForUserInTrip
}