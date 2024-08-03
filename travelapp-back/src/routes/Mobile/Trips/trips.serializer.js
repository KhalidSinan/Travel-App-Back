function tripData(trip) {
    return {
        source: trip.starting_place,
        destinations: trip.destinations,
        start_date: trip.start_date,
        overall_price: trip.overall_price,
        num_of_people: trip.num_of_people,
        num_of_days: trip.overall_num_of_days
    }
}

module.exports = {
    tripData
}