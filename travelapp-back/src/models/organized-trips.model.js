const OrganizedTrip = require('./organized-trips.mongo')

async function getAllOrganizedTrips(filter) {
    const query = { available_seats: { $gt: 0 } }
    Object.assign(query, filter)
    return await OrganizedTrip.find(query)
        .populate({ path: 'trip_id', populate: { path: 'user_id' } })
}

async function getOneOrganizedTrip(_id) {
    return await OrganizedTrip.findOne({ _id })
        .populate({ path: 'trip_id', populate: { path: 'destinations.activities', populate: 'place' } })
        .populate({ path: 'trip_id', populate: { path: 'flights', populate: 'flights' } })
        .populate({ path: 'trip_id', populate: { path: 'hotels', populate: 'hotel_id' } })
        .populate({ path: 'organizer_id', populate: { path: 'user_id', select: 'name' }, select: 'user_id' })
}

async function postOrganizedtrip(data) {
    return await OrganizedTrip.create(data);
}

async function decrementSeats(trip, decrement) {
    trip.available_seats -= decrement;
    await trip.save();
}

async function makeDiscount(trip, discount) {
    trip.discount = discount;
    await trip.save();
}

async function addReview(user_id, stars, trip) {
    trip.reviews.push({
        user_id,
        stars
    })
    await trip.save();
}

async function incrementSeats(trip, increment) {
    trip.available_seats += increment;
    await trip.save();
}

async function getOrganizedTripsCount() {
    return (await OrganizedTrip.distinct('trip_id')).length;
}

async function deleteOrganizedTrip(_id) {
    return await OrganizedTrip.deleteOne({ _id });
}

async function getOneOrganizedTripBasedOnTripID(trip_id) {
    return await OrganizedTrip.findOne({ trip_id })
}

async function getRevenueFromOrganizedTrips(start_date, end_date) {
    return await OrganizedTrip.find({
        createdAt: { $gte: start_date, $lt: end_date }
    });
}

async function getAllOrganizedTripForCron(filter) {
    return await OrganizedTrip.find()
        .populate('trip_id')
}


module.exports = {
    getAllOrganizedTrips,
    getOneOrganizedTrip,
    postOrganizedtrip,
    decrementSeats,
    makeDiscount,
    addReview,
    incrementSeats,
    getOrganizedTripsCount,
    deleteOrganizedTrip,
    getOneOrganizedTripBasedOnTripID,
    getRevenueFromOrganizedTrips,
    getAllOrganizedTripForCron
}