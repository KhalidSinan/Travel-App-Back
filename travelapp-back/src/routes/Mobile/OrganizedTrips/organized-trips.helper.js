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

function filterOrganizedTripsShown(trips, organizedTripsShown) {
    let data = []
    if (organizedTripsShown == 'AnnouncedTrips') {
        data = trips.filter(trip => trip.is_announced == true)
    }
    else if (organizedTripsShown == 'AlmostComplete') {
        data = trips.filter(trip => trip.is_almost_complete == true)
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

function getCountriesInOrganizedTrip(trip) {
    const destinations = trip.trip_id.destinations
    return destinations.map(dest => dest.destination.country_name)
}

function getOrganizedTripStatus(trip) {
    let status = 'On Going';
    const start_date = trip.start_date;
    const end_date = trip.end_date;
    const now = new Date();
    if (start_date > now) status = 'Waiting'
    else if (end_date < now) status = 'Finished'
    return status
}

function getOrganizedTripReservationHelper(reservations) {
    let data = []
    reservations.forEach(res => data.push(...res.reservation_data))
    return data
}

async function assignTypesToOrganizedTrips(trips) {
    let data = []
    for (let trip of trips) {
        let temp = JSON.parse(JSON.stringify(trip))
        temp.is_announced = false
        temp.is_almost_complete = false
        const taken = trip.overall_seats - trip.available_seats
        const percentage = taken / trip.overall_seats * 100
        const checkAnnounced = await getAnnouncementForOrganizedTrip(trip._id);
        if (checkAnnounced.length > 0) temp.is_announced = true;
        if (percentage >= 70) temp.is_almost_complete = true;
        temp.destinations = getCountriesInOrganizedTrip(temp)
        data.push(temp)
    }
    return data
}

module.exports = {
    getAllOrganizedByCountry,
    getFilterForOrganizedTrips,
    filterOrganizedTrips,
    filterOrganizedTripsShown,
    removeOldOrganizedTrips,
    calculateAnnouncementOptions,
    getCountriesInOrganizedTrip,
    getOrganizedTripStatus,
    getOrganizedTripReservationHelper,
    assignTypesToOrganizedTrips
}