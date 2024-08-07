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
    return Trip.find({ is_shared: true, 'destinations.city_name': city })
        .populate('destinations.activities.place');
}

async function getTripsCount() {
    return Trip.find().countDocuments();
}

async function removeActivityFromSchedule(trip_id, activity_id) {
    return await Trip.findOneAndUpdate(
        { _id: trip_id, "destinations.activities._id": activity_id },
        { $pull: { "destinations.$[].activities": { _id: activity_id } } }
    );
}

async function addActivityToSchedule(trip_id, destination_id, place_id, description) {
    const data = {
        _id: new mongoose.Types.ObjectId(),
        place: place_id,
        description: description
    };

    return await Trip.findOneAndUpdate(
        { _id: trip_id, "destinations._id": destination_id },
        { $push: { "destinations.$[dest].activities": data } },
        {
            arrayFilters: [
                { "dest._id": destination_id }
            ]
        }
    )
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