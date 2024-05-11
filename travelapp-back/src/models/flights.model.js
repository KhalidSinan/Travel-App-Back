const Flight = require('./flights.mongo')

async function getFlights(skip, limit, filter) {
    return await Flight.find(filter)
        .skip(skip)
        .limit(limit)
        .select('-source._id -destination._id')
}

async function getFlight(id) {
    return await Flight.findById(id).select('-source._id -destination._id -classes._id')

}

async function addFlights(data) {
    return await Flight.create(data);
}

module.exports = {
    getFlights,
    getFlight,
    addFlights
}