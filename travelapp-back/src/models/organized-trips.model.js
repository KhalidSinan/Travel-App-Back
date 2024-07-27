const OrganizedTrip = require('./organized-trips.mongo')

async function getAllOrganizedTrips() {
    return await OrganizedTrip.find().populate('trip_id');
}

async function getOneOrganizedTrip(_id) {
    return await OrganizedTrip.findOne({ _id });
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

async function incrementSeats(trip, decrement) {
    trip.available_seats += decrement;
    await trip.save();
}

async function getOrganizedTripsCount() {
    return (await OrganizedTrip.distinct('trip_id')).length;
}

module.exports = {
    getAllOrganizedTrips,
    getOneOrganizedTrip,
    postOrganizedtrip,
    decrementSeats,
    makeDiscount,
    addReview,
    incrementSeats,
    getOrganizedTripsCount
}