const { convertDateStringToDate } = require("../../../services/convertTime");
const { getAnnouncementForOrganizedTrip } = require('../../../models/announcements.model');
const { getDeviceTokens } = require("../../../models/users.model");

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

function getFilterForOrganizedTrips(filterType, filterPrice) {
    let data = {};
    if (filterType.length > 0) {
        Object.assign(data, { type_of_trip: { $all: filterType } })
    }
    if (filterPrice.start_price != "" && filterPrice.end_price != "") {
        Object.assign(data, { price: { $gt: filterPrice.start_price, $lt: filterPrice.end_price } })
    }
    return data
}

function filterOrganizedTrips(trips, filterDate, filterDestinations) {
    let data1 = trips
    let data2 = trips
    if (filterDate.start_date != "" || filterDate.end_date != "") {
        data1 = []
        if (filterDate.start_date != "") filterDate.start_date = convertDateStringToDate(filterDate.start_date)
        if (filterDate.end_date != "") filterDate.end_date = convertDateStringToDate(filterDate.end_date)
        data1 = trips.filter(trip => {
            let matchesStartDate = true;
            let matchesEndDate = true;
            trip.trip_id.start_date.setHours(0, 0, 0, 0)
            if (filterDate.start_date != "") {
                matchesStartDate = trip.trip_id.start_date >= filterDate.start_date;
            }

            if (filterDate.end_date != "") {
                matchesEndDate = trip.trip_id.start_date <= filterDate.end_date;
            }
            return matchesStartDate && matchesEndDate;
        });
    }
    if (filterDestinations.length > 0) {
        data2 = []
        const destinations = filterDestinations
        trips.forEach(trip => {
            const tripDestinations = trip.trip_id.destinations.map(destination => destination.country_name)
            const commonDestinations = tripDestinations.filter(destination => destinations.includes(destination));
            if (commonDestinations.length == destinations.length) data2.push(trip)
        })
    }
    if ((filterDate.start_date == "" && filterDate.end_date == "") && filterDestinations.length == 0) return trips
    return data1.filter(trip => data2.includes(trip));
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

function getCountriesInOrganizedTrip(trip) {
    const destinations = trip.trip_id.destinations
    return destinations.map(dest => ({ country: dest.country_name, city: dest.city_name, num_of_days: dest.num_of_days }))
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

function putTypeChosenFirst(trips, filterType) {
    trips.forEach(trip => {
        const commonTypes = trip.type_of_trip.filter(type => filterType.includes(type));
        const remainingTypes = trip.type_of_trip.filter(type => !filterType.includes(type));
        trip.type_of_trip = [...commonTypes, ...remainingTypes]
    });
    return trips
}

function putDestinationsChosenFirst(trips, filterDestinations) {
    trips.forEach(trip => {
        const commonDestinations = trip.destinations.filter(destination => filterDestinations.includes(destination));
        const remainingDestinations = trip.destinations.filter(destination => !filterDestinations.includes(destination));
        trip.destinations = [...commonDestinations, ...remainingDestinations]
    });
    return trips
}

function putHotelReservationWithRoomData(reservations, room_types) {
    let data = []
    reservations.forEach(reservation => {
        const room = room_types.find(room => room.code == reservation.code)
        let temp = {
            code: room.code,
            type: room.type,
            description: room.description,
            bed_options: room.bed_options,
            bed_options_count: room.bed_options_count,
            sleeps_count: room.sleeps_count,
            smoking_allowed: room.smoking_allowed,
            view: room.view,
            amenities: room.amenities,
            images: room.images,
            count_reserved: reservation.count,
        }
        data.push(temp)
    })
    return data;
}

async function getDeviceTokensForUsersInOrganizedTrip(reservations) {
    let users = []
    reservations.forEach(reservation => {
        users.push(reservation.user_id)
    })
    let device_tokens = []
    for (const user of users) {
        const device_token = await getDeviceTokens(user)
        device_tokens.push(device_token[0])
    }
    return device_tokens
}

module.exports = {
    getAllOrganizedByCountry,
    getFilterForOrganizedTrips,
    filterOrganizedTrips,
    filterOrganizedTripsShown,
    removeOldOrganizedTrips,
    getCountriesInOrganizedTrip,
    getOrganizedTripStatus,
    getOrganizedTripReservationHelper,
    assignTypesToOrganizedTrips,
    putTypeChosenFirst,
    putDestinationsChosenFirst,
    putHotelReservationWithRoomData,
    getDeviceTokensForUsersInOrganizedTrip
}