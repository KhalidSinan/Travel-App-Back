const { getPagination } = require('../../services/query');
const { serializedData } = require('../../services/serializeArray');
const { getFlights, getFlight, getFlightsCount } = require('../../models/flights.model')
const { validationErrors } = require('../../middlewares/validationErrors');
const { validateGetFlights, validateGetFlight } = require('./flights.validation');
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

    console.log(date, date_end);
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
        console.log(length);
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

// // Maybe Disabled Person
// async function httpReserveFlight(req, res) {
//     const { error } = validateReserveFlight(req.body)
//     if (error) return res.status(400).json({ message: validationErrors(error.details) })

//     // Get Data
//     const user_id = req.user._id
//     const reservation_type = req.body.reservation_type
//     const flights = req.params.id

//     const flight = await getFlight(flights);
//     if (!flight) return res.status(404).json({ message: 'Flight Not Found' })

//     const num_of_reservations = req.body.num_of_reservations
//     if (num_of_reservations > flight.available_seats) return res.status(400).json({ message: 'Flight Seats Not Enough' })

//     // Ready Reservations
//     const overall_price = await reserveFlightHelper(req.body.reservations, flight, user_id)

//     // Post Reservations
//     const data = {
//         user_id, flights, num_of_reservations: req.body.reservations.length,
//         reservations: req.body.reservations, overall_price, reservation_type
//     }
//     const user_balance = await getWallet(user_id)
//     if (user_balance.wallet_account < overall_price || user_balance.wallet_account == 0) return res.status(400).json({ message: 'Insufficient Balance' })

//     const reservation = await postReservation(data)
//     await putWallet(user_id, -overall_price);

//     return res.status(200).json({ message: 'Flight Reserved Successfully', reservation })
// }

module.exports = {
    httpGetFlights,
    httpGetFlight,
    httpGetSearchPageData,
}