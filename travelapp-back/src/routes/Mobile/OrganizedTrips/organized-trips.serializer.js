function getOrganizedTrips(organized_trip) {
    const start_date = new Date(organized_trip.trip_id.start_date)
    const num_of_people_participating = organized_trip.overall_seats - organized_trip.available_seats
    const starting_place = organized_trip.trip_id.starting_place.city + ', ' + organized_trip.trip_id.starting_place.country
    const organizer_name = organized_trip.trip_id.user_id.name.first_name + ' ' + organized_trip.trip_id.user_id.name.last_name
    return {
        organizer_name: organizer_name,
        starting_place: starting_place,
        trip_type: organized_trip.type_of_trip,
        price: organized_trip.price.toFixed(2),
        starting_date: start_date.toLocaleDateString('en-GB'),
        num_of_people_participating: num_of_people_participating
    }
}

module.exports = {
    getOrganizedTrips
}