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
    await Trip.findOneAndUpdate(
        { _id: trip_id, "destinations.activities.place": activity_id },
        { $pull: { "destinations.$[].activities": { place: activity_id } } }
    );
    await Trip.findOneAndUpdate(
        { _id: trip_id },
        { $pull: { "places_to_visit": activity_id } }
    );
}

async function addActivityToSchedule(trip_id, city_name, place_id, day) {
    const data = {
        _id: new mongoose.Types.ObjectId(),
        place: place_id,
        day: day
    };

    await Trip.findOneAndUpdate(
        { _id: trip_id, "destinations.city_name": city_name },
        { $push: { "destinations.$[dest].activities": data } },
        {
            arrayFilters: [
                { "dest.city_name": city_name }
            ]
        }
    )
    return await Trip.findOneAndUpdate(
        { _id: trip_id },
        { $push: { "places_to_visit": place_id } },
    )
}

async function getTripsEndingToday(start_of_day, end_of_day) {
    return await Trip.find({
        end_date: {
            $gte: start_of_day,
            $lte: end_of_day
        }
    })
}

async function getTripActivities(id) {
    return Trip.findById(id).populate('destinations.activities.place');
}

async function makeActivityNotify(trip_id, place_id, time = null) {
    await Trip.findOneAndUpdate(
        {
            _id: trip_id,
            "destinations.activities.place": place_id // Only proceed if there are matching activities
        },
        {
            $set: {
                "destinations.$[dest].activities.$[act].notifiable": true,
                "destinations.$[dest].activities.$[act].notification_time": time,
            },
        },
        {
            arrayFilters: [
                { "dest.activities.place": place_id }, // Match only destinations with the specified place
                { "act.place": place_id }              // Match only activities with the specified place
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
    addActivityToSchedule,
    getTripsEndingToday,
    getTripActivities,
    makeActivityNotify
}