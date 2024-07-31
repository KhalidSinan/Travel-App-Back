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
        trip_type: organized_trip.type_of_trip,
        price: organized_trip.price.toFixed(2),
        starting_date: start_date.toLocaleDateString('en-GB'),
        num_of_people_participating: num_of_people_participating
    }
}

function getOrganizedTripDetails(organized_trip) {
    const start_date = new Date(organized_trip.trip_id.start_date)
    const num_of_people_participating = organized_trip.overall_seats - organized_trip.available_seats
    const countries = getCountriesInOrganizedTrip(organized_trip)
    const status_of_trip = getOrganizedTripStatus(organized_trip)
    const reservation_data = getOrganizedTripReservationHelper(organized_trip.reservations)
    return {
        countries: countries,
        num_of_countries: countries.length,
        starting_date: start_date.toLocaleDateString('en-GB'),
        trip_type: organized_trip.type_of_trip,
        num_of_people_participating: num_of_people_participating,
        num_of_people_participating_with_you: num_of_people_participating + 1,
        overall_seats: organized_trip.overall_seats,
        status_of_trip: status_of_trip,
        price: organized_trip.price.toFixed(2),
        reservations: serializedData(reservation_data, getOrganizedTripReservationDetails)
    }
}

function getOrganizedTripReservationDetails(reservation) {
    return {
        name: reservation.name,
        gender: reservation.gender,
        passport_number: reservation.passport_number,
    }
}

module.exports = {
    getOrganizedTrips,
    getOrganizedTripDetails
}