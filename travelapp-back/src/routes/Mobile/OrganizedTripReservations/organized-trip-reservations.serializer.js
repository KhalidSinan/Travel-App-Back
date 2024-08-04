function organizedTripReservationData(organized_trip) {
    console.log(organized_trip)
    return {
        starting_place: organized_trip.trip_id.trip_id.starting_place,
        destinations: organized_trip.trip_id.trip_id.destinations,
        start_date: organized_trip.trip_id.start_date,
        overall_price: organized_trip.overall_price,
        num_of_people: organized_trip.num_of_people,
        type_of_trip: organized_trip.trip_id.type_of_trip,
        organizer_name: organized_trip.trip_id.trip_id.user_id.name.first_name + organized_trip.trip_id.trip_id.user_id.name.last_name,
    }
}

module.exports = {
    organizedTripReservationData
}