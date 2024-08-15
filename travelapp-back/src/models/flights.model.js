const Flight = require('./flights.mongo')

async function getFlights(skip, limit, filter) {
    return await Flight.find(filter)
        .skip(skip)
        .limit(limit)
        .select('-source._id -destination._id')
}

async function getFlightsCount(filter) {
    return await Flight.find(filter).countDocuments()
}

async function getFlight(id) {
    return await Flight.findById(id).select('-source._id -destination._id -classes._id')

}

async function addFlights(data) {
    return await Flight.create(data);
}

async function getFlightsCount(filter) {
    return await Flight.find(filter).countDocuments();
}

async function getTop10Countries() {
    return await Flight.aggregate([
        { $group: { _id: '$destination.country', count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, country: '$_id', count: 1 } }
    ])
}

async function getAllCountries() {
    return await Flight.aggregate([
        { $group: { _id: '$destination.country', count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, country: '$_id', count: 1 } }
    ])
}

async function getCountriesFlightsInAMonth(country, lastMonthStart, lastMonthEnd) {
    return await Flight.find({ 'destination.country': country, 'departure_date.dateTime': { $gte: lastMonthStart, $lte: lastMonthEnd } }).countDocuments();
}

async function getAllAirlines() {
    return await Flight.aggregate([
        { $group: { _id: { name: '$airline.name', logo: '$airline.logo' }, count: { $sum: 1 } } },
        { $project: { _id: 0, airline: '$_id.name', logo: '$_id.logo', count: 1 } }
    ])
}

async function incrementFlightSeats(flight, classType, increment) {
    flight = await Flight.findOne(flight)
    flight.available_seats += +increment;
    const classIndex = flight.classes.findIndex(temp => temp.code === classType);
    flight.classes[classIndex].available_seats += increment;
    return await flight.save()
}

module.exports = {
    getFlights,
    getFlight,
    addFlights,
    getFlightsCount,
    getTop10Countries,
    getAllCountries,
    getCountriesFlightsInAMonth,
    getFlightsCount,
    getAllAirlines,
    incrementFlightSeats
}