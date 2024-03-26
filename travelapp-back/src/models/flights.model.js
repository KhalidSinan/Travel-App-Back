const Flight = require('./flights.mongo')

async function getFlights(skip, limit) {
    return await Flight.find()
        .skip(skip)
        .limit(limit)
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