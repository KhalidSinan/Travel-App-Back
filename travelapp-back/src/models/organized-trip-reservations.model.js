const OrganizedTripReservations = require('./organized-trip-reservations.mongo')

async function postOrganizedTripReservation(data) {
    return await OrganizedTripReservations.create(data)
}

async function getOrganizedTripReservationsForUser(user_id) {
    return await OrganizedTripReservations.find({ user_id })
        .populate({ path: 'trip_id', populate: { path: 'trip_id', populate: 'user_id' } })
        .populate({ path: 'trip_id', populate: { path: 'organizer_id', populate: 'user_id' } })
}

async function getOrganizedTripReservationsForUserInTrip(user_id, trip_id) {
    return await OrganizedTripReservations.find({ user_id, trip_id })
}

async function getOrganizedTripReservationsForOneTrip(id) {
    return await OrganizedTripReservations.find({ trip_id: id })
}

async function getOrganizedTripReservation(id) {
    return await OrganizedTripReservations.findById(id)
}

async function updateReservationData(reservation, data) {
    reservation.reservation_data = data;
    await reservation.save();
}

async function updateReservationDataOverallPrice(reservation, price) {
    reservation.overall_price = price;
    await reservation.save();
}

async function deleteOrganizedTripReservations(trip_id) {
    await OrganizedTripReservations.deleteMany({ trip_id })
}

async function getOrganizedTripsReservationsTrip(user_id) {
    return await OrganizedTripReservations.find({ user_id }).distinct('trip_id');
}

async function getOrganizedTripsReservationsUsersID(trip_id) {
    return await OrganizedTripReservations.find({ trip_id }).distinct('user_id');
}

module.exports = {
    postOrganizedTripReservation,
    getOrganizedTripReservationsForUser,
    getOrganizedTripReservationsForOneTrip,
    getOrganizedTripReservationsForUserInTrip,
    getOrganizedTripReservation,
    updateReservationData,
    updateReservationDataOverallPrice,
    deleteOrganizedTripReservations,
    getOrganizedTripsReservationsTrip,
    getOrganizedTripsReservationsUsersID
}