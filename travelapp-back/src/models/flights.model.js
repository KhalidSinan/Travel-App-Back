const Flight = require('./flights.mongo')

async function getFlights(skip, limit, filter) {
    return await Flight.find(filter)
        .skip(skip)
        .limit(limit)
        .select('-source._id -destination._id')
}

async function getFlight(id) {
    return await Flight.findById(id);
}

// async function addFlights(data) {
//     return await Flight.create(data[0]);
// }

module.exports = {
    getFlights,
    getFlight,
}