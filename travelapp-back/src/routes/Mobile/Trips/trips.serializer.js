function tripData(trip) {
    return {
        source: trip.starting_place.city + ', ' + trip.starting_place.country,
        destinations: trip.destinations.map(dest => dest.city_name).join(' - '),
        start_date: trip.start_date.toLocaleDateString('en-GB'),
        overall_price: trip.overall_price,
        num_of_people: trip.num_of_people,
        num_of_days: trip.overall_num_of_days,
        completed: trip.end_date < new Date() ? true : false
    }
}

module.exports = {
    tripData
}