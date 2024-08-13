function organizedTripReservationData(organized_trip) {
    return {
        id: organized_trip.trip_id._id,
        starting_place: organized_trip.trip_id.trip_id.starting_place.city + ', ' + organized_trip.trip_id.trip_id.starting_place.country,
        destinations: organized_trip.trip_id.trip_id.destinations.map(dest => dest.city_name).join(' - '),
        start_date: organized_trip.trip_id.trip_id.start_date.toLocaleDateString('en-GB'),
        overall_price: organized_trip.overall_price,
        num_of_people: organized_trip.num_of_people,
        num_of_days: organized_trip.trip_id.trip_id.overall_num_of_days,
        type_of_trip: organized_trip.trip_id.type_of_trip,
        organizer_name: organized_trip.trip_id.trip_id.user_id.name.first_name + ' ' + organized_trip.trip_id.trip_id.user_id.name.last_name,
        completed: organized_trip.trip_id.trip_id.end_date < new Date() ? true : false
    }
}

function organizedTripReservationDetails(reservation) {
    return {
        name: reservation.name,
        passport_number: reservation.passport_number,
    }
}

function organizedTripReservationDetailsForUser(reservation) {
    return {
        id: reservation._id,
        main_reservation_id: reservation.main_reservation_id,
        name: reservation.name,
        passport_number: reservation.passport_number,
    }
}

module.exports = {
    organizedTripReservationData,
    organizedTripReservationDetails,
    organizedTripReservationDetailsForUser
}