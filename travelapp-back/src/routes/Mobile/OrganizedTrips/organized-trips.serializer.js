const { msToTime } = require("../../../services/convertTime")
const { serializedData } = require("../../../services/serializeArray")
const { getCountriesInOrganizedTrip, getOrganizedTripStatus, getOrganizedTripReservationHelper } = require("./organized-trips.helper")

function getOrganizedTrips(organized_trip) {
    const start_date = new Date(organized_trip.trip_id.start_date)
    const num_of_people_participating = organized_trip.overall_seats - organized_trip.available_seats
    const starting_place = organized_trip.trip_id.starting_place.city + ', ' + organized_trip.trip_id.starting_place.country
    const organizer_name = organized_trip.trip_id.user_id.name.first_name + ' ' + organized_trip.trip_id.user_id.name.last_name
    return {
        id: organized_trip._id,
        organizer_name: organizer_name,
        starting_place: starting_place,
        trip_type: organized_trip.is_announced ? organized_trip.type_of_trip.slice(0, 3) : organized_trip.type_of_trip.slice(0, 2),
        destinations: organized_trip.is_announced ? organized_trip.destinations.slice(0, 3) : organized_trip.destinations.slice(0, 2),
        price: organized_trip.price.toFixed(2),
        starting_date: start_date.toLocaleDateString('en-GB'),
        num_of_people_participating: `${num_of_people_participating}/${organized_trip.overall_seats}`,
        is_almost_complete: organized_trip.is_almost_complete,
        is_announced: organized_trip.is_announced,
    }
}

function getOrganizedTripDetails(organized_trip) {
    let remaining = organized_trip.trip_id.start_date.valueOf() - Date.now()
    let remaining_time = msToTime(remaining)
    if (remaining_time.seconds < 0) remaining_time = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const start_date = new Date(organized_trip.trip_id.start_date)
    const num_of_people_participating = organized_trip.overall_seats - organized_trip.available_seats
    const destinations = getCountriesInOrganizedTrip(organized_trip)
    const status_of_trip = getOrganizedTripStatus(organized_trip)
    const reservation_data = getOrganizedTripReservationHelper(organized_trip.reservations)
    return {
        destinations: destinations,
        num_of_countries: destinations.length,
        starting_date: start_date.toLocaleDateString('en-GB'),
        trip_type: organized_trip.type_of_trip,
        num_of_people_participating: num_of_people_participating,
        overall_seats: organized_trip.overall_seats,
        status_of_trip: status_of_trip,
        price: organized_trip.price.toFixed(2),
        reservations: serializedData(reservation_data, getOrganizedTripReservationDetails),
        remaining_time: remaining_time,
    }
}

function getOrganizedTripReservationDetails(reservation) {
    return {
        name: reservation.name,
    }
}

function getOrganizedTripScheduleDetails(schedule) {
    return {
        country: schedule.country_name,
        city: schedule.city_name,
        num_of_days: schedule.num_of_days,
        activities: serializedData(schedule.activities, activitiesDetails),
    }
}

function activitiesDetails(activity) {
    const address = activity.place.address.address + ', ' + activity.place.address.city + ', ' + activity.place.address.country
    return {
        place_name: activity.place.name,
        place_description: activity.place.description,
        place_location: address,
        description: activity.description,
        notifiable: activity.notifiable
    }
}

module.exports = {
    getOrganizedTrips,
    getOrganizedTripDetails,
    getOrganizedTripScheduleDetails
}