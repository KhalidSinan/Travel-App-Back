const { serializedData } = require("../../../services/serializeArray");

function organizersData(organizer) {
    const name = organizer.user_id.name.first_name + ' ' + organizer.user_id.name.last_name
    return {
        id: organizer._id,
        organizer_name: name,
        company_name: organizer.company_name,
        rating: organizer.rating,
        profile_pic: organizer.user_id.profile_pic
    }
}

function organizerData(organizer) {
    const name = organizer.user_id.name.first_name + ' ' + organizer.user_id.name.last_name;
    const phone = '+' + organizer.user_id.phone.country_code + ' ' + organizer.user_id.phone.number;
    const age = (Date.now() - organizer.user_id.date_of_birth) / 1000 / 60 / 60 / 24 / 365
    return {
        organizer_name: name,
        company_name: organizer.company_name,
        rating: organizer.rating,
        profile_pic: organizer.user_id.profile_pic,
        gender: organizer.user_id.gender,
        phone: phone,
        location: organizer.user_id.location.city + ', ' + organizer.user_id.location.country,
        age: age.toFixed(0),
        num_of_trips: organizer.num_of_trips,
        years_of_experience: organizer.years_of_experience,
        num_of_reports: organizer.num_of_reports,
        num_of_warnings: organizer.num_of_warnings,
        proofs: organizer.proofs,
        trips: serializedData(organizer.trips, tripData)
    }
}

function tripData(trip) {
    return {
        id: trip._id,
        start_date: trip.trip_id.start_date.toLocaleDateString('en-GB'),
        end_date: trip.trip_id.end_date.toLocaleDateString('en-GB'),
        price: trip.price,
        commission: trip.commission,
        num_of_people: trip.overall_seats - trip.available_seats,
        num_of_destinations: trip.trip_id.destinations.length
    }
}

function tripDetailsData(trip) {
    return {
        start_date: trip.trip_id.start_date.toLocaleDateString('en-GB'),
        end_date: trip.trip_id.end_date.toLocaleDateString('en-GB'),
        price: trip.price,
        commission: trip.commission,
        num_of_people: trip.overall_seats - trip.available_seats,
        num_of_destinations: trip.trip_id.destinations.length,
        hotels: serializedData(trip.trip_id.hotels, hotelTripDetails),
        places: serializedData(trip.trip_id.places_to_visit, placeTripDetails),
        // flights: trip.trip_id.flights
        flights: serializedData(trip.trip_id.flights, flightTripDetails)
    }
}

function hotelTripDetails(hotel) {
    const totalRooms = hotel.room_codes.reduce((acc, room) => {
        return acc + room.count;
    }, 0);
    return {
        hotel_name: hotel.hotel_id.name,
        hotel_location: hotel.hotel_id.location.city + ', ' + hotel.hotel_id.location.country,
        hotel_stars: hotel.hotel_id.stars,
        start_date: hotel.start_date.toLocaleDateString('en-GB'),
        end_date: hotel.end_date.toLocaleDateString('en-GB'),
        overall_price: hotel.room_price,
        num_of_rooms: totalRooms,
    }
}

function placeTripDetails(place) {
    const phone = '+' + place.phone_number.country_code + ' ' + place.phone_number.number;
    const location = place.address.address + ', ' + place.address.city + ', ' + place.address.country
    return {
        name: place.name,
        location: location,
        category: place.category,
        phone_number: phone,
    }
}

function flightTripDetails(flight) {
    const source = flight.flights[0].source.city + ', ' + flight.flights[0].source.country
    const destination = flight.flights[0].destination.city + ', ' + flight.flights[0].destination.country
    return {
        source: source,
        destination: destination,
        duration: flight.flights[0].duration,
        airline: flight.flights[0].airline.name,
        source_airport: flight.flights[0].source.name,
        destination_airport: flight.flights[0].destination.name,
        date: flight.flights[0].departure_date.date,
        class: flight.reservations.data[0].seat_class,
        price: flight.reservations.overall_price
    }
}


/* 

*/


module.exports = {
    organizersData,
    organizerData,
    tripDetailsData
}