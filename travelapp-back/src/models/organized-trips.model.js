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

module.exports = {
    getAllOrganizedTrips,
    getOneOrganizedTrip,
    postOrganizedtrip,
    decrementSeats
}