const { getPagination } = require('../../../services/query');
const { serializedData } = require('../../../services/serializeArray');
const { getFlights, getFlight, getFlightsCount } = require('../../../models/flights.model')
const { validationErrors } = require('../../../middlewares/validationErrors');
const { validateGetFlights, validateGetFlight, validateGetFlightsOptions } = require('./flights.validation');
const { flightData, twoWayFlightData, twoWayFlightDataDetails, flightDataDetails, flightDataForCheck } = require('./flights.serializer');
const { getFlightsReqDataHelper, getFlightsOneWayDataHelper, getFlightsTwoWayDataHelper, getFlightsTimeFilterHelper, getFlightsPriceFilterHelper, oneWaySorter, twoWaySorter, getTwoWayFlightsTimeFilterHelper } = require('./flights.helper');
const { getCities, getCountries, getAirlines } = require('../../../services/locations')

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

// City
async function httpGetFlightsForTrip(req, res) {
    const { error } = await validateGetFlightsOptions(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) });

    const classes = ['A', 'B', 'C']
    const classIndex = classes.indexOf(req.body.class_of_seats)

    let days = 0;
    let data = [];
    let departure_date;
    const destinations = req.body.destinations;
    for (let i = 0; i < destinations.length + +req.body.is_return; i++) {
        let [day, month, year] = req.body.start_date.split('/');
        day = +day + days;
        let newDate = new Date(year, month, day, 3)
        const newMonth = newDate.getUTCMonth() < 10 ? `0${newDate.getUTCMonth()}` : newDate.getUTCMonth()
        const newDay = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate()
        departure_date = `${newDay}/${newMonth}/${newDate.getFullYear()}`;

        const source = i != 0 ? destinations[i - 1].city : req.body.source
        const destination = i != destinations.length ? destinations[i].city : req.body.source
        const filter = { 'departure_date.date': departure_date, 'source.city': source, 'destination.city': destination }

        let reason = 'No Flights Available';
        let flights = await getFlights(0, 0, filter);
        flights = getFlightsOneWayDataHelper(flights, req.body.num_of_seats, classIndex, destinations[i]?.filter?.airline ?? null)
        const lengthToCompare = flights.length

        if (destinations[i]?.filter) {
            let { time_start, time_end, min_price, max_price } = destinations[i].filter
            if (time_start != null && time_end != null) flights = getFlightsTimeFilterHelper(departure_date, time_start, time_end, flights)
            if (min_price != null && max_price != null) flights = getFlightsPriceFilterHelper(min_price, max_price, flights)
        }
        if (flights.length != lengthToCompare) reason = "The Filter Criteria Doesn't Match Flights"

        reason = flights.length > 0 ? 'Flights Available' : reason
        data.push({
            city: destination,
            flight: flights.length > 0 ? flightDataForCheck(flights[0]) : null,
            is_available: flights.length > 0 ?? false,
            reason: reason
        })
        if (i < destinations.length) {
            days += destinations[i].days;
        }
    }

    return res.status(200).json({ data: data, count: data.length })
}

// Done
function httpGetCitiesAndAirlines(req, res) {
    const cities = getCities();
    const airlines = getAirlines();
    return res.status(200).json({ message: 'Data Retreived Successfully', cities, airlines })
}

module.exports = {
    httpGetFlights,
    httpGetFlight,
    httpGetSearchPageData,
    httpGetFlightsForTrip,
    httpGetCitiesAndAirlines
}