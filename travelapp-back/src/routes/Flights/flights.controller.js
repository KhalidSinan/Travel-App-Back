const { getPagination } = require('../../services/query');
const { serializedData } = require('../../services/serializeArray');
const { getWallet, putWallet } = require('../../models/users.model')
const { getFlights, getFlight } = require('../../models/flights.model')
const { validationErrors } = require('../../middlewares/validationErrors');
const { postReservation, getReservation, putConfirmation, removeReservation } = require('../../models/plane-reservation.model');
const { validateReserveFlight, validateGetFlights, validateGetFlight } = require('./flights.validation');
const { reservationData, flightData, twoWayFlightData, twoWayFlightDataDetails, flightDataDetails } = require('./flights.serializer');
const { getFlightsDataSortHelper, getFlightsReqDataHelper, getFlightsOneWayDataHelper, getFlightsTwoWayDataHelper, getFlightsTimeFilterHelper, reserveFlightHelper, findCancelRate } = require('./flights.helper')

// Done
async function httpGetFlights(req, res) {
    const { error } = await validateGetFlights({ source: req.query.source, destination: req.query.destination, date: req.query.date, num_of_seats: req.query.num_of_seats, class_of_seats: req.query.class_of_seats })
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const { skip, limit } = getPagination(req.query)
    const filter = { 'departure_date.date': req.query.date, 'source.country': req.query.source, 'destination.country': req.query.destination }
    const { source, destination, num_of_seats, class_of_seats, sort, type, date, date_end, airline, time_start, time_end } = getFlightsReqDataHelper(req)

    const classes = ['A', 'B', 'C']
    const classIndex = classes.indexOf(class_of_seats)

    const flights = await getFlights(skip, limit, filter);
    let data = getFlightsOneWayDataHelper(flights, num_of_seats, classIndex, airline)
    if (time_start && time_end) data = getFlightsTimeFilterHelper(date, time_start, time_end, data)

    if (type == 'Two-Way') {
        const filter_back = { 'departure_date.date': date_end, 'source.country': destination, 'destination.country': source }
        Object.assign(filter_back, req.query)
        const flights_back = await getFlights(skip, limit, filter_back);
        data = getFlightsTwoWayDataHelper(flights, flights_back, num_of_seats, classIndex, airline)
        getFlightsDataSortHelper(sort, data)
        return res.status(200).json({ data: serializedData(data, twoWayFlightData) })
    }

    getFlightsDataSortHelper(sort, data)
    return res.status(200).json({ data: serializedData(data, flightData) })
}

//Done
async function httpGetFlight(req, res) {
    const { error } = await validateGetFlight(req.query)
    if (error) {
        return res.status(400).json({ message: 'Second ID Not Valid' })
    }
    const flight = await getFlight(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Not Found' })
    let data = flight;
    if (req.query.id_back) {
        const flight_back = await getFlight(req.query.id_back);
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
        console.log(reserv)
        if (reservations.length == 0) reservations = JSON.parse(JSON.stringify(reserv));
        else if (reservations_back.length == 0) reservations_back = JSON.parse(JSON.stringify(reserv));
        overall_price += price
    }
    overall_price = overall_price.toFixed(2)
    // Ready Reservations
    // Need to fix reservation back
    // Post Reservations
    const data = {
        user_id, flights, num_of_reservations, reservations,
        reservations_back, overall_price, reservation_type
    }
    const reservation = await postReservation(data)

    return res.status(200).json({ message: 'Flight Reserved Successfully', reservation })
}

// Done
async function httpConfirmReservation(req, res) {
    const reservation = await getReservation(req.params.id)
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
    const person_reservation = reservation.reservations.find(res => res._id.equals(id))
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
}