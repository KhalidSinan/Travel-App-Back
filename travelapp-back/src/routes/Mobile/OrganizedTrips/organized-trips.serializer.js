const { msToTime, convertToTimeFormat } = require("../../../services/convertTime")
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
        price: organized_trip.price,
        starting_date: start_date.toLocaleDateString('en-GB'),
        num_of_people_participating: `${num_of_people_participating}/${organized_trip.overall_seats}`,
        is_almost_complete: organized_trip.is_almost_complete,
        is_announced: organized_trip.is_announced,
    }
}

function getOrganizedTripDetails(organized_trip) {
    const organizer_name = organized_trip.organizer_id.user_id.name.first_name + ' ' + organized_trip.organizer_id.user_id.name.last_name
    const start_date = new Date(organized_trip.trip_id.start_date)
    const end_date = new Date(organized_trip.trip_id.end_date)
    const num_of_people_participating = organized_trip.overall_seats - organized_trip.available_seats
    const destinations = getCountriesInOrganizedTrip(organized_trip)
    const status_of_trip = getOrganizedTripStatus(organized_trip)
    let flights = organized_trip.trip_id.flights
    let hotels = organized_trip.trip_id.hotels
    let days = 0
    return {
        id: organized_trip._id,
        organizer_name: organizer_name,
        source: { city: organized_trip.trip_id.starting_place.city, country: organized_trip.trip_id.starting_place.country },
        destinations: destinations.map((dest, index) => {
            days += dest.num_of_days;
            return destinationData(dest, flights[index], hotels[index], start_date, days)
        }),
        num_of_destination: destinations.length,
        trip_type: organized_trip.type_of_trip,
        num_of_people_participating: num_of_people_participating,
        start_date: start_date.toLocaleDateString('en-GB'),
        end_date: end_date.toLocaleDateString('en-GB'),
        num_of_days: organized_trip.trip_id.overall_num_of_days,
        overall_seats: organized_trip.overall_seats,
        status_of_trip: status_of_trip,
        price: organized_trip.price,
    }
}

function destinationData(destination, flight, hotel, start_date, days) {
    let start_date2 = new Date(start_date)
    start_date2.setUTCDate(start_date.getUTCDate() + days)
    let end_date = new Date(start_date2)
    end_date.setUTCDate(start_date2.getUTCDate() + destination.num_of_days)
    let ticket = getOrganizedTripFlightDetails(flight)
    let hotelData = getOrganizedTripHotelDetails(hotel)
    return {
        destination: { country: destination.country, city: destination.city },
        num_of_days: destination.num_of_days,
        start_date: start_date2.toLocaleDateString('en-GB'),
        end_date: end_date.toLocaleDateString('en-GB'),
        ticket: ticket,
        hotel: hotelData,
        overall_price: (ticket.flight_price + hotelData.price).toFixed(2)
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
        hotel_description: hotel.hotel_id.description,
        hotel_stars: hotel.hotel_id.stars,
        hotel_location: hotelLocationData(hotel.hotel_id.location),
        image: hotel.hotel_id.images[0],
        price: hotel.room_codes[0].price,
        start_date: hotel.start_date.toLocaleDateString('en-GB'),
        end_date: hotel.end_date.toLocaleDateString('en-GB'),
        rooms_reserved: putHotelReservationWithRoomData(hotel.room_codes, hotel.hotel_id.room_types),
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
    const seat_class = flight.reservations.data[0].seat_class
    const flight_price = flight.flights[0].classes.find(type => type.code == seat_class).price
    return {
        id: flight.flights[0]._id,
        source: sourceDestinationData(flight.flights[0].source),
        destination: sourceDestinationData(flight.flights[0].destination),
        airline: { name: flight.flights[0].airline.name, logo: flight.flights[0].airline.logo },
        duration: convertToTimeFormat(flight.flights[0].duration),
        departure_date: dateData(flight.flights[0].departure_date),
        arrival_date: dateData(flight.flights[0].arrival_date),
        flight_price: flight_price,
        flight_class: seat_class,
    }
}

function getOrganizedTripScheduleDetails(schedule) {
    let organizedSchedule = {
        country: schedule.country_name,
        city: schedule.city_name,
        num_of_days: schedule.num_of_days,
        activities: {}
    };
    schedule.activities.forEach(activity => {
        const day = activity.day;
        if (!organizedSchedule.activities[day]) {
            organizedSchedule.activities[day] = [];
        }
        organizedSchedule.activities[day].push(activitiesDetails(activity));
    });
    return organizedSchedule;
}

function activitiesDetails(activity) {
    const address = activity.place.address.address + ', ' + activity.place.address.city + ', ' + activity.place.address.country
    return {
        place_name: activity.place.name,
        place_description: activity.place.description,
        place_location: address,
        description: activity.description,
        notifiable: activity.notifiable,
    }
}

function myOrganizedTripsData(organized_trip) {
    const start_date = new Date(organized_trip.trip_id.start_date)
    const num_of_people_participating = organized_trip.overall_seats - organized_trip.available_seats
    const starting_place = organized_trip.trip_id.starting_place.city + ', ' + organized_trip.trip_id.starting_place.country
    return {
        id: organized_trip._id,
        starting_place: starting_place,
        destinations: organized_trip.trip_id.destinations.map(dest => dest.city_name).join(' - '),
        price: organized_trip.price,
        starting_date: start_date.toLocaleDateString('en-GB'),
        num_of_people_participating: `${num_of_people_participating}/${organized_trip.overall_seats}`,
        is_complete: organized_trip.trip_id.end_date < new Date() ? true : false,
    }
}

module.exports = {
    getOrganizedTrips,
    getOrganizedTripDetails,
    getOrganizedTripScheduleDetails,
    myOrganizedTripsData
}