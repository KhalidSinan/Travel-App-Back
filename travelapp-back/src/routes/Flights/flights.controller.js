const { getPagination } = require('../../services/query');
const { serializedData } = require('../../services/serializeArray');
const { getWallet, putWallet } = require('../../models/users.model')
const { getFlights, getFlight } = require('../../models/flights.model')
const { validationErrors } = require('../../middlewares/validationErrors');
const { postReservation, getReservation, putConfirmation, removeReservation } = require('../../models/plane-reservation.model');
const { validateReserveFlight, validateGetFlights, validateGetFlight } = require('./flights.validation');
const { reservationData, flightData, twoWayFlightData, twoWayFlightDataDetails, flightDataDetails } = require('./flights.serializer');
const { getFlightsReqDataHelper, getFlightsOneWayDataHelper, getFlightsTwoWayDataHelper, getFlightsTimeFilterHelper, reserveFlightHelper, findCancelRate, getCountries, getAirlines, getFlightsPriceFilterHelper, oneWaySorter, twoWaySorter, getTwoWayFlightsTimeFilterHelper, changeClassName } = require('./flights.helper')

// Done
// async function httpGetFlights(req, res) {
//     const { error } = await validateGetFlights({ source: req.query.source, destination: req.query.destination, date: req.query.date, num_of_seats: req.query.num_of_seats, class_of_seats: req.query.class_of_seats })
//     if (error) return res.status(400).json({ message: validationErrors(error.details) })

//     const { skip, limit } = getPagination(req.query)
//     const filter = { 'departure_date.date': req.query.date, 'source.country': req.query.source, 'destination.country': req.query.destination }
//     const { source, destination, num_of_seats, class_of_seats, sort, type, date, date_end, airline, time_start, time_end } = getFlightsReqDataHelper(req)

//     const classes = ['A', 'B', 'C']
//     const classIndex = classes.indexOf(class_of_seats)

//     const flights = await getFlights(skip, limit, filter);
//     let data = getFlightsOneWayDataHelper(flights, num_of_seats, classIndex, airline)
//     if (time_start && time_end) data = getFlightsTimeFilterHelper(date, time_start, time_end, data)

//     if (type == 'Two-Way') {
//         const filter_back = { 'departure_date.date': date_end, 'source.country': destination, 'destination.country': source }
//         Object.assign(filter_back, req.query)
//         const flights_back = await getFlights(skip, limit, filter_back);
//         data = getFlightsTwoWayDataHelper(flights, flights_back, num_of_seats, classIndex, airline)
//         getFlightsDataSortHelper(sort, data)
//         return res.status(200).json({ data: serializedData(data, twoWayFlightData) })
//     }

//     getFlightsDataSortHelper(sort, data)
//     return res.status(200).json({ data: serializedData(data, flightData) })
// }

// Done
function httpGetSearchPageData(req, res) {
    const countries = getCountries();
    const airlines = getAirlines();
    return res.status(200).json({ message: 'Data Retreived Successfully', countries, airlines })
}

async function httpGetFlights(req, res) {
    const { error } = await validateGetFlights({ source: req.body.source, destination: req.body.destination, date: req.body.date, num_of_seats: req.body.num_of_seats, class_of_seats: req.body.class_of_seats })
    if (error) return res.status(400).json({ message: validationErrors(error.details) })
    const { skip, limit } = getPagination(req.query)

    const filter = { 'departure_date.date': req.body.date, 'source.country': req.body.source, 'destination.country': req.body.destination }
    const { source, destination, date, num_of_seats, class_of_seats, sort, sortBy, two_way, date_end, airline, time_start, time_end, min_price, max_price } = getFlightsReqDataHelper(req)

    const classes = ['A', 'B', 'C']
    const classIndex = classes.indexOf(class_of_seats)

    const flights = await getFlights(skip, limit, filter);
    let data = getFlightsOneWayDataHelper(flights, num_of_seats, classIndex, airline)
    if (time_start && time_end) data = getFlightsTimeFilterHelper(date, time_start, time_end, data)
    if (min_price && max_price) data = getFlightsPriceFilterHelper(min_price, max_price, data)

    if (two_way) {
        const filter_back = { 'departure_date.date': date_end, 'source.country': destination, 'destination.country': source }
        Object.assign(filter_back, req.query)
        const flights_back = await getFlights(skip, limit, filter_back);
        data = getFlightsTwoWayDataHelper(flights, flights_back, num_of_seats, classIndex, airline)
        if (time_start && time_end) data = getTwoWayFlightsTimeFilterHelper(date, time_start, time_end, data)
        if (min_price && max_price) data = getFlightsPriceFilterHelper(min_price, max_price, data)
        twoWaySorter(sortBy, sort, data)
        return res.status(200).json({ data: serializedData(data, twoWayFlightData) })
    }
    oneWaySorter(sortBy, sort, data)
    return res.status(200).json({ data: serializedData(data, flightData) })
}

//Done
async function httpGetFlight(req, res) {
    const { error } = await validateGetFlight(req.query)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })
    const flight = await getFlight(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Not Found' })
    flight.class = flight.classes.find(flight_class => flight_class.code == req.query.class)
    let data = flight;
    if (req.query.id_back) {
        const flight_back = await getFlight(req.query.id_back);
        flight_back.class = flight.classes.find(flight_class => flight_class.code == req.query.class)
        if (!flight_back) return res.status(404).json({ message: 'Not Found' })
        data = { flight, flight_back }
        return res.status(200).json({ two_way: true, data: twoWayFlightDataDetails(data) })
    }
    return res.status(200).json({ two_way: false, data: flightDataDetails(data) })
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

async function httpReserveFlight(req, res) {
    const { error } = await validateReserveFlight(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })


    // Get Data
    const user_id = req.user._id
    const reservation_type = req.body.reservation_type
    const flights = req.body.flights
    const reservationData = req.body.reservations
    const num_of_reservations = req.body.reservations.length
    let overall_price = 0;
    let reservations_back = [], reservations = []
    for (const flight_id of flights) {

        const flight = await getFlight(flight_id)
        if (!flight) return res.status(404).json({ message: 'Flight Not Found' })
        if (num_of_reservations > flight.available_seats) return res.status(400).json({ message: 'Flight Seats Not Enough' })
        const { price, reserv } = await reserveFlightHelper(reservationData, flight, user_id)
        if (reservations.length == 0) reservations = { data: JSON.parse(JSON.stringify(reserv)), overall_price: price.toFixed(2) }
        else if (reservations_back.length == 0) reservations_back = { data: JSON.parse(JSON.stringify(reserv)), overall_price: price.toFixed(2) }
        overall_price += price
    }
    overall_price = overall_price.toFixed(2)


    changeClassName(reservations, reservations_back)

    const data = {
        user_id, flights, num_of_reservations, reservations,
        reservations_back, overall_price, reservation_type
    }
    const reservation = await postReservation(data)

    return res.status(200).json({ message: 'Flight Reserved Successfully', reservation })
}

// Done
async function httpConfirmReservation(req, res) {
    const reservation = await getReservation(req.body.id)
    const user_id = req.user._id
    if (!user_id.equals(reservation.user_id)) {
        return res.status(400).json({
            message: 'Cant Access This Reservation'
        })
    }
    await putConfirmation(reservation, true)
    return res.status(200).json({
        message: 'Reservation Confirmed'
    })
}

// Done
async function httpCancelReservation(req, res) {
    const reservation = await getReservation(req.params.id)
    const user_id = req.user._id
    if (!user_id.equals(reservation.user_id)) {
        return res.status(400).json({
            message: 'Cant Access This Reservation'
        })
    }
    const id = req.body.person_id;
    const person_reservation = reservation.reservations.data.find(res => res._id.equals(id))
    if (!person_reservation) {
        return res.status(200).json({
            message: 'Person Reservation Not Found'
        })
    }
    const fee = await findCancelRate(reservation, person_reservation.price) // Money That Will Be Returned
    await removeReservation(reservation, person_reservation)
    await putWallet(req.user.id, fee);
    return res.status(200).json({
        message: 'Reservation Cancelled'
    })
    // Delete All Reservations
    // const reservation = await getReservation(req.params.id)
    // const user_id = req.user._id
    // if (!user_id.equals(reservation.user_id)) {
    //     return res.status(400).json({
    //         message: 'Cant Access This Reservation'
    //     })
    // }
    // const fee = await findCancelRate(reservation)
    // await putWallet(req.user.id, fee);
    // await putConfirmation(reservation, false)
    // return res.status(200).json({
    //     message: 'Reservation Cancelled'
    // })
}

async function httpGetReservation(req, res) {
    const reservation = await getReservation(req.params.id)
    const user_id = req.user._id
    if (!user_id.equals(reservation.user_id)) {
        return res.status(400).json({
            message: 'Cant Access This Reservation'
        })
    }
    const fee = await findCancelRate(reservation)
    reservation.fee = fee
    return res.status(200).json({
        message: 'Reservation Data Retrieved Successfully',
        reservation: reservationData(reservation)
    })
}


module.exports = {
    httpGetFlights,
    httpGetFlight,
    httpReserveFlight,
    httpGetReservation,
    httpConfirmReservation,
    httpCancelReservation,
    httpGetSearchPageData
}