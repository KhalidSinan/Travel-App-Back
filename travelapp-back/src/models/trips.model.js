const mongoose = require('mongoose');
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

async function getTripsCount() {
    return Trip.find().countDocuments();
}

async function removeActivityFromSchedule(trip_id, activity_id) {
    return await Trip.findOneAndUpdate(
        { _id: trip_id, "destinations.destination.cities.activities._id": activity_id },
        { $pull: { "destinations.$[].destination.cities.$[].activities": { _id: activity_id } } }
    );
}

async function addActivityToSchedule(trip_id, country_id, city_id, place_id, description) {
    const data = {
        _id: new mongoose.Types.ObjectId(),
        place: place_id,
        description: description
    };

    return await Trip.findOneAndUpdate(
        {
            _id: trip_id, // Match the specific trip
            "destinations._id": country_id, // Match the specific destination (country)
            "destinations.destination.cities._id": city_id // Match the specific city
        },
        {
            $push: { "destinations.$[dest].destination.cities.$[city].activities": data }
        },
        {
            arrayFilters: [
                { "dest._id": country_id }, // Filter for the correct destination
                { "city._id": city_id } // Filter for the correct city
            ]
        }
    );
}


module.exports = {
    getTrip,
    deleteTrip,
    shareTrip,
    cancelTrip,
    getSharedTrips,
    getTripsCount,
    removeActivityFromSchedule,
    addActivityToSchedule
}