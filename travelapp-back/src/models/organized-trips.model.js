const OrganizedTrip = require('./organized-trips.mongo')

async function getAllOrganizedTrips() {
    return await OrganizedTrip.find().populate('trip_id');
}

async function getOneOrganizedTrip(_id) {
    return await OrganizedTrip.find({ _id });
}

async function postOrganizedtrip(data) {
    return await OrganizedTrip.create(data);
}

module.exports = {
    getAllOrganizedTrips,
    getOneOrganizedTrip,
    postOrganizedtrip
}