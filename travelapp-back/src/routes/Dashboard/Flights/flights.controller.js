const { getFlights, getFlightsCount } = require("../../../models/flights.model")
const { getPagination } = require('../../../services/query')
const { serializedData } = require('../../../services/serializeArray');
const { flightFilterHelper, getFlightsHelper } = require("./flights.helper");
const { flightsData } = require("./flights.serializer");

// make serializer
async function httpGetFlights(req, res) {
    req.query.limit = 10
    const { skip, limit } = getPagination(req.query);
    const filter = flightFilterHelper(req.query.start_date ?? null, req.query.end_date ?? null, req.query.search ?? null)
    const flightsCount = await getFlightsCount(filter);
    let flights = await getFlights(skip, limit, filter);
    flights = await getFlightsHelper(flights)

    return res.status(200).json({
        message: 'Flights Found',
        count: flightsCount,
        data: serializedData(flights, flightsData)
    });
}

module.exports = {
    httpGetFlights,
};
