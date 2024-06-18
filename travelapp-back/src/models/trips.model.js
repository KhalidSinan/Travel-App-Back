// create trip
// update trip
// share trip
// autogenerate trip

const Trip = require('./trips.mongo')

async function getTrip(id) {
    return Trip.findById(id);
}

module.exports = {
    getTrip,
}