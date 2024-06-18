const { getPagination } = require('../../../services/query');
const { serializedData } = require('../../../services/serializeArray');
const { getFlights, getFlight, getFlightsCount } = require('../../../models/flights.model')
const { validationErrors } = require('../../../middlewares/validationErrors');
const { validateGetFlights, validateGetFlight, validateGetFlightsOptions } = require('./flights.validation');
const { flightData, twoWayFlightData, twoWayFlightDataDetails, flightDataDetails } = require('./flights.serializer');
const { getFlightsReqDataHelper, getFlightsOneWayDataHelper, getFlightsTwoWayDataHelper, getFlightsTimeFilterHelper, getCountries, getAirlines, getFlightsPriceFilterHelper, oneWaySorter, twoWaySorter, getTwoWayFlightsTimeFilterHelper } = require('./flights.helper');


// Done
function httpGetSearchPageData(req, res) {
    const countries = getCountries();
    const airlines = getAirlines();
    return res.status(200).json({ message: 'Data Retreived Successfully', countries, airlines })
}

// Done
async function httpGetFlights(req, res) {
    const { error } = await validateGetFlights({ source: req.body.source, destination: req.body.destination, date: req.body.date, num_of_seats: req.body.num_of_seats, class_of_seats: req.body.class_of_seats })
    if (error) return res.status(400).json({ message: validationErrors(error.details) })
    const { skip, limit } = getPagination(req.query)
    const filter = { 'departure_date.date': req.body.date, 'source.country': req.body.source, 'destination.country': req.body.destination }
    const { source, destination, date, num_of_seats, class_of_seats, sort, sortBy, two_way, date_end, airline, time_start, time_end, min_price, max_price } = getFlightsReqDataHelper(req)

    const classes = ['A', 'B', 'C']
    const classIndex = classes.indexOf(class_of_seats)
    let flights = await getFlights(skip, limit, filter);
    const count = await getFlightsCount(filter)
    let data = getFlightsOneWayDataHelper(flights, num_of_seats, classIndex, airline)
    if (time_start && time_end) data = getFlightsTimeFilterHelper(date, time_start, time_end, data)
    if (min_price && max_price) data = getFlightsPriceFilterHelper(min_price, max_price, data)

    if (two_way) {
        flights = await getFlights(0, 0, filter);
        const filter_back = { 'departure_date.date': date_end, 'source.country': destination, 'destination.country': source }
        // Object.assign(filter_back, req.query)
        const flights_back = await getFlights(0, 0, filter_back);
        data = getFlightsTwoWayDataHelper(flights, flights_back, num_of_seats, classIndex, airline)
        if (time_start && time_end) data = getTwoWayFlightsTimeFilterHelper(date, time_start, time_end, data)
        if (min_price && max_price) data = getFlightsPriceFilterHelper(min_price, max_price, data)
        const length = data.length;
        if (data.length > limit) {
            data = data.slice(skip, skip + limit)
        }
        twoWaySorter(sortBy, sort, data)
        return res.status(200).json({ data: serializedData(data, twoWayFlightData), count: length })
    }
    oneWaySorter(sortBy, sort, data)
    return res.status(200).json({ data: serializedData(data, flightData), count: count })
}

//Done
async function httpGetFlight(req, res) {
    const { error } = await validateGetFlight(req.query)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })
    const flight = await getFlight(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight Not Found' })
    flight.class = flight.classes.find(flight_class => flight_class.code == req.query.class)
    let data = flight;
    if (req.query.id_back) {
        const flight_back = await getFlight(req.query.id_back);
        flight_back.class = flight.classes.find(flight_class => flight_class.code == req.query.class)
        if (!flight_back) return res.status(404).json({ message: 'Flight Not Found' })
        data = { flight, flight_back }
        return res.status(200).json({ two_way: true, data: twoWayFlightDataDetails(data) })
    }
    return res.status(200).json({ two_way: false, data: { flight: flightDataDetails(data) } })
}

async function httpGetFlightsOptions(req, res) {
    const { error } = await validateGetFlightsOptions({ source: req.body.source, destinations: req.body.destinations, start_date: req.body.start_date, num_of_seats: req.body.num_of_seats, class_of_seats: req.body.class_of_seats, is_return: req.body.is_return })
    if (error) return res.status(400).json({ message: validationErrors(error.details) });

    const classes = ['A', 'B', 'C']
    const classIndex = classes.indexOf(req.body.class_of_seats)

    let days = 0;
    let data = [];
    let departure_date;
    const destinations = req.body.destinations;
    for (let i = 0; i < destinations.length; i++) {
        let [day, month, year] = req.body.start_date.split('/');
        day = +day + days;
        let newDate = new Date(year, month, day, 3)
        const newMonth = newDate.getUTCMonth() < 10 ? `0${newDate.getUTCMonth()}` : newDate.getUTCMonth()
        departure_date = `${newDate.getDate()}/${newMonth}/${newDate.getFullYear()}`;
        const source = i != 0 ? destinations[i - 1].country : req.body.source
        const filter = { 'departure_date.date': departure_date, 'source.country': source, 'destination.country': destinations[i].country }
        let flights = await getFlights(0, 0, filter);
        flights = getFlightsOneWayDataHelper(flights, req.body.num_of_seats, classIndex, req.body.airline)
        if (destinations[i].filter) {
            let { time_start, time_end, min_price, max_price } = destinations[i].filter
            if (time_start && time_end) flights = getFlightsTimeFilterHelper(departure_date, time_start, time_end, flights)
            if (min_price && max_price) flights = getFlightsPriceFilterHelper(min_price, max_price, flights)
        }

        data.push({
            country: destinations[i].country,
            count: flights.length,
            is_available: flights.length > 0 ?? false
        })

        days += destinations[i].days;
    }
    if (req.body.is_return) {
        let [day, month, year] = req.body.start_date.split('/');
        day = +day + days;
        let newDate = new Date(year, month, day, 3)
        const newMonth = newDate.getUTCMonth() < 10 ? `0${newDate.getUTCMonth()}` : newDate.getUTCMonth()
        departure_date = `${newDate.getDate()}/${newMonth}/${newDate.getFullYear()}`;
        const filter = { 'departure_date.date': departure_date, 'source.country': destinations[destinations.length - 1].country, 'destination.country': req.body.source }
        let flights = await getFlights(0, 0, filter);
        flights = getFlightsOneWayDataHelper(flights, req.body.num_of_seats, classIndex, req.body.airline)
        if (destinations[destinations.length - 1].filter) {
            let { time_start, time_end, min_price, max_price } = destinations[i].filter
            if (time_start && time_end) flights = getFlightsTimeFilterHelper(departure_date, time_start, time_end, flights)
            if (min_price && max_price) flights = getFlightsPriceFilterHelper(min_price, max_price, flights)
        }

        data.push({
            country: req.body.source,
            count: flights.length,
            is_available: flights.length > 0 ?? false
        })
    }

    return res.status(200).json({ data: data, count: data.length })
}

async function httpGetFlightsOptions2(req, res) {
    const { error } = await validateGetFlightsOptions({ source: req.body.source, destinations: req.body.destinations, start_date: req.body.start_date, num_of_seats: req.body.num_of_seats, class_of_seats: req.body.class_of_seats, is_return: req.body.is_return })
    if (error) return res.status(400).json({ message: validationErrors(error.details) });

    const classes = ['A', 'B', 'C']
    const classIndex = classes.indexOf(req.body.class_of_seats)

    let days = 0;
    let data = [];
    let departure_date;
    const destinations = req.body.destinations;
    for (let i = 0; i < destinations.length; i++) {
        let [day, month, year] = req.body.start_date.split('/');
        day = +day + days;
        let newDate = new Date(year, month, day, 3)
        const newMonth = newDate.getUTCMonth() < 10 ? `0${newDate.getUTCMonth()}` : newDate.getUTCMonth()
        departure_date = `${newDate.getDate()}/${newMonth}/${newDate.getFullYear()}`;
        const source = i != 0 ? destinations[i - 1].country : req.body.source
        const filter = { 'departure_date.date': departure_date, 'source.country': source, 'destination.country': destinations[i].country }
        let flights = await getFlights(0, 0, filter);
        flights = getFlightsOneWayDataHelper(flights, req.body.num_of_seats, classIndex, req.body.airline)
        if (destinations[i].filter) {
            let { time_start, time_end, min_price, max_price } = destinations[i].filter
            if (time_start && time_end) flights = getFlightsTimeFilterHelper(departure_date, time_start, time_end, flights)
            if (min_price && max_price) flights = getFlightsPriceFilterHelper(min_price, max_price, flights)
        }
        data.push({
            country: destinations[i].country,
            flight: flights.length > 0 ? flightData(flights[0]) : null,
            is_available: flights.length > 0 ?? false
        })

        days += destinations[i].days;
    }
    if (req.body.is_return) {
        let [day, month, year] = req.body.start_date.split('/');
        day = +day + days;
        let newDate = new Date(year, month, day, 3)
        const newMonth = newDate.getUTCMonth() < 10 ? `0${newDate.getUTCMonth()}` : newDate.getUTCMonth()
        departure_date = `${newDate.getDate()}/${newMonth}/${newDate.getFullYear()}`;
        const filter = { 'departure_date.date': departure_date, 'source.country': destinations[destinations.length - 1].country, 'destination.country': req.body.source }
        let flights = await getFlights(0, 0, filter);
        flights = getFlightsOneWayDataHelper(flights, req.body.num_of_seats, classIndex, req.body.airline)
        if (destinations[destinations.length - 1].filter) {
            let { time_start, time_end, min_price, max_price } = destinations[i].filter
            if (time_start && time_end) flights = getFlightsTimeFilterHelper(departure_date, time_start, time_end, flights)
            if (min_price && max_price) flights = getFlightsPriceFilterHelper(min_price, max_price, flights)
        }

        data.push({
            country: req.body.source,
            flight: flights.length > 0 ? flightData(flights[0]) : null,
            is_available: flights.length > 0 ?? false
        })
    }

    return res.status(200).json({ data: data, count: data.length })
}

module.exports = {
    httpGetFlights,
    httpGetFlight,
    httpGetSearchPageData,
    httpGetFlightsOptions,
    httpGetFlightsOptions2,
}