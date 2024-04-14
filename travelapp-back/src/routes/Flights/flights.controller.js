const { getFlights, getFlight } = require('../../models/flights.model')
const { postReservation, getReservation, putConfirmation } = require('../../models/plane-reservation.model');
const { validateReserveFlight, validateConfirmFlight, validateGetFlights } = require('./flights.validation');
const { validationErrors } = require('../../middlewares/validationErrors');
const { getPagination } = require('../../services/query');
const { getWallet, putWallet } = require('../../models/users.model')
const { convertTime12to24 } = require('../../services/convertTime');
const { reservationData } = require('./flights.serializer');

async function httpGetFlights(req, res) {
    const { error } = await validateGetFlights({ source: req.query.source, destination: req.query.destination, date: req.query.date })
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const { skip, limit } = getPagination(req.query)
    const filter = { 'due_date.date': req.query.date, 'source.country': req.query.source, 'destination.country': req.query.destination }

    // To Stop Duplicate
    delete req.query.skip
    delete req.query.limit
    delete req.query.date
    delete req.query.source
    delete req.query.destination

    // Put req.query into filter
    Object.assign(filter, req.query)
    
    // One-Way
    const flights = await getFlights(skip, limit, filter);
    return res.status(200).json({ data: flights })
}

async function httpGetFlight(req, res) {
    const flight = await getFlight(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Not Found' })
    return res.status(200).json({ data: flight })
}

async function httpReserveFlight(req, res) {
    const { error } = validateReserveFlight(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    // Get Data
    const user_id = req.user._id
    const reservation_type = req.body.reservation_type
    const flight_id = req.params.id

    const flight = await getFlight(flight_id);
    if (!flight) return res.status(404).json({ message: 'Flight Not Found' })

    const num_of_reservations = req.body.num_of_reservations
    if (num_of_reservations > flight.available_seats) return res.status(400).json({ message: 'Flight Seats Not Enough' })

    // Ready Reservations
    const overall_price = await reserveFlightHelper(req.body.reservations, flight, user_id)

    // Post Reservations
    const data = {
        user_id, flight_id, num_of_reservations: req.body.reservations.length,
        reservations: req.body.reservations, overall_price, reservation_type
    }
    const user_balance = await getWallet(user_id)
    if (user_balance.wallet_account < overall_price || user_balance.wallet_account == 0) return res.status(400).json({ message: 'Insufficient Balance' })

    const reservation = await postReservation(data)
    await putWallet(user_id, -overall_price);

    return res.status(200).json({ message: 'Flight Reserved Successfully', reservation })
}

async function reserveFlightHelper(reservations, flight, user_id) {
    const classes = ['A', 'B', 'C']
    let overall_price = 0;
    reservations.forEach(reservation => {
        reservation.price = flight.classes[classes.indexOf(reservation.seat_class)].price
        reservation.user_id = user_id;
        overall_price += reservation.price
        reservation.seat_number = reservation.seat_class + flight.classes[classes.indexOf(reservation.seat_class)].available_seats
        flight.available_seats--;
        flight.classes[classes.indexOf(reservation.seat_class)].available_seats--;
    })
    // Save Flight Changes
    await flight.save();
    return overall_price
}

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

async function httpCancelReservation(req, res) {
    const reservation = await getReservation(req.params.id)
    const user_id = req.user._id
    if (!user_id.equals(reservation.user_id)) {
        return res.status(400).json({
            message: 'Cant Access This Reservation'
        })
    }
    const fee = await findCancelRate(reservation)
    await putWallet(req.user.id, fee);
    await putConfirmation(reservation, false)
    return res.status(200).json({
        message: 'Reservation Cancelled'
    })
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

async function findCancelRate(reservation) {
    const date = new Date(reservation.flight_id[0].due_date.date)
    const time = convertTime12to24(reservation.flight_id[0].due_date.time)
    date.setUTCHours(time[0], time[1], time[2])
    const timeDifference = date - Date.now()
    const chance = 2 * 60 * 60 * 1000
    let rate = 0.2; // 0.2 will be back
    if (timeDifference < chance) rate = 0; // Nothing is back
    return reservation.overall_price * rate
}



module.exports = {
    httpGetFlights,
    httpGetFlight,
    httpReserveFlight,
    httpGetReservation,
    httpConfirmReservation,
    httpCancelReservation,
}