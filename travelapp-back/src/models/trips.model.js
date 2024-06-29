const Trip = require('./trips.mongo')

async function getTrip(id) {
    return Trip.findById(id);
}

async function deleteTrip(id) {
    return Trip.findByIdAndDelete(id);
}

async function shareTrip(id) {
    return Trip.findByIdAndUpdate(id, { is_shared: true });
}

async function cancelTrip(id) {
    return Trip.findByIdAndUpdate(id, { is_canceled: true });
}

async function getSharedTrips(city) {
    return Trip.find({ is_shared: true, 'destinations.destination.cities.city_name': city })
        .populate('destinations.destination.cities.activities.place');
}

module.exports = {
    getTrip,
    deleteTrip,
    shareTrip,
    cancelTrip,
    getSharedTrips
}