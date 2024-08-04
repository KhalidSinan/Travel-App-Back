function organizedTripReservationData(organized_trip) {
    return {
        starting_place: organized_trip.trip_id.trip_id.starting_place.city + ', ' + organized_trip.trip_id.trip_id.starting_place.country,
        destinations: organized_trip.trip_id.trip_id.destinations.map(dest => dest.city_name).join(' - '),
        start_date: organized_trip.trip_id.trip_id.start_date.toLocaleDateString('en-GB'),
        overall_price: organized_trip.overall_price,
        num_of_people: organized_trip.num_of_people,
        type_of_trip: organized_trip.trip_id.type_of_trip,
        organizer_name: organized_trip.trip_id.trip_id.user_id.name.first_name + ' ' + organized_trip.trip_id.trip_id.user_id.name.last_name,
    }
}

module.exports = {
    organizedTripReservationData
}