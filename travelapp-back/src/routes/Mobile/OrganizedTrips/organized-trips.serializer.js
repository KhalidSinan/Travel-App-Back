const { msToTime } = require("../../../services/convertTime")
const { serializedData } = require("../../../services/serializeArray")
const { getCountriesInOrganizedTrip, getOrganizedTripStatus, getOrganizedTripReservationHelper, putHotelReservationWithRoomData } = require("./organized-trips.helper")

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
    console.log(organized_trip)
    let remaining = organized_trip.trip_id.start_date.valueOf() - Date.now()
    let remaining_time = msToTime(remaining)
    if (remaining_time.seconds < 0) remaining_time = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const start_date = new Date(organized_trip.trip_id.start_date)
    const end_date = new Date(organized_trip.trip_id.end_date)
    const num_of_people_participating = organized_trip.overall_seats - organized_trip.available_seats
    const destinations = getCountriesInOrganizedTrip(organized_trip)
    const status_of_trip = getOrganizedTripStatus(organized_trip)
    return {
        destinations: destinations,
        num_of_destination: destinations.length,
        starting_date: start_date.toLocaleDateString('en-GB'),
        trip_type: organized_trip.type_of_trip,
        num_of_people_participating: num_of_people_participating,
        start_date: start_date.toLocaleDateString('en-GB'),
        end_date: end_date.toLocaleDateString('en-GB'),
        num_of_days: organized_trip.trip_id.overall_num_of_days,
        overall_seats: organized_trip.overall_seats,
        status_of_trip: status_of_trip,
        price: organized_trip.price,
        flights: serializedData(organized_trip.trip_id.flights, getOrganizedTripFlightDetails),
        hotels: serializedData(organized_trip.trip_id.hotels, getOrganizedTripHotelDetails),
    }
}

function hotelLocationData(location) {
    return {
        address: location.name,
        city: location.city,
        country: location.country,
    }
}

function getOrganizedTripHotelDetails(hotel) {
    return {
        hotel_id: hotel.hotel_id._id,
        hotel_name: hotel.hotel_id.name,
        hotel_location: hotelLocationData(hotel.hotel_id.location),
        overall_price: hotel.overall_price,
        start_date: hotel.start_date.toLocaleDateString('en-GB'),
        end_date: hotel.end_date.toLocaleDateString('en-GB'),
        rooms_reserved: putHotelReservationWithRoomData(hotel.room_codes, hotel.hotel_id.room_types)
    }
}

function sourceDestinationData(source) {
    return {
        name: source.name,
        city: source.city,
        country: source.country,
    }
}

function dateData(date) {
    return {
        date: date.date,
        time: date.time,
    }
}

function getOrganizedTripFlightDetails(flight) {
    return {
        source: sourceDestinationData(flight.flights[0].source),
        destination: sourceDestinationData(flight.flights[0].destination),
        duration: flight.flights[0].duration,
        departure_date: dateData(flight.flights[0].departure_date),
        arrival_date: dateData(flight.flights[0].arrival_date),
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