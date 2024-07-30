const { convertDateStringToDate } = require("../../../services/convertTime");
const { getAnnouncementForOrganizedTrip } = require('../../../models/announcements.model')
function removeOldOrganizedTrips(trips) {
    let data = []
    trips.forEach(trip => {
        if (trip.trip_id.start_date > new Date()) data.push(trip)
    })
    return data
}

function getAllOrganizedByCountry(trips, country) {
    if (country) {
        let data = []
        trips.forEach(trip => {
            if (trip.trip_id.starting_place.country == country) data.push(trip)
        })
        return data
    }
    else return trips
}

function getFilterForOrganizedTrips(filterType, filter) {
    let data = {};
    if (filterType == 'TripType') {
        data = { type_of_trip: { $in: filter.start } }
    }
    else if (filterType == 'Price') {
        data = { price: { $gt: filter.start, $lt: filter.last } }
    }
    return data
}

function filterOrganizedTrips(trips, filterType, filter) {
    let data = []
    if (filterType == 'Date') {
        filter.start = convertDateStringToDate(filter.start)
        filter.last = convertDateStringToDate(filter.last)
        trips.forEach(trip => {
            if (trip.trip_id.start_date > filter.start && trip.trip_id.start < filter.last) data.push(trip)
        })
    }
    else if (filterType == 'Destinations') {
        const destinations = filter.start
        trips.forEach(trip => {
            const tripDestinations = trip.trip_id.destinations.map(destination => destination.destination.country_name)
            const commonDestinations = tripDestinations.filter(destination => destinations.includes(destination));
            if (commonDestinations.length == destinations.length) data.push(trip)
        })
    } else {
        data = trips
    }
    return data
}

async function filterOrganizedTripsShown(trips, organizedTripsShown) {
    let data = []
    if (organizedTripsShown == 'AnnouncedTrips') {
        for (const trip of trips) {
            const checkAnnounced = await getAnnouncementForOrganizedTrip(trip._id);
            if (checkAnnounced.length > 0) data.push(trip);
        }
    }
    else if (organizedTripsShown == 'AlmostComplete') {
        trips.forEach(trip => {
            const taken = trip.overall_seats - trip.available_seats
            const percentage = taken / trip.overall_seats * 100
            if (percentage >= 70) data.push(trip)
        })
    }
    else data = trips

    return data
}

function calculateAnnouncementOptions(trip) {
    const homePageMultiplier = 1.5;
    const endingOfAnnouncement = Math.floor((trip.start_date - new Date()) / 1000 / 60 / 60 / 24)
    const oneDay = 200
    const threeDays = 550
    const oneWeek = 1150
    const tillTheStartOfTheTrip = Math.floor(endingOfAnnouncement * oneDay - endingOfAnnouncement * (oneDay / 1.5))
    const organizedTripsPageOptions = {
        oneDay,
        threeDays,
        oneWeek,
        tillTheStartOfTheTrip,
    }
    const homePageOptions = {
        oneDay: oneDay * homePageMultiplier,
        threeDays: threeDays * homePageMultiplier,
        oneWeek: oneWeek * homePageMultiplier,
        tillTheStartOfTheTrip: tillTheStartOfTheTrip * homePageMultiplier,
    }
    return {
        homePageOptions,
        organizedTripsPageOptions
    }
}

module.exports = {
    getAllOrganizedByCountry,
    getFilterForOrganizedTrips,
    filterOrganizedTrips,
    filterOrganizedTripsShown,
    removeOldOrganizedTrips,
    calculateAnnouncementOptions
}