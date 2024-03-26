const { getFlights, getFlight } = require('../../models/flights.model')
const { postReservation } = require('../../models/plane-reservation.model');
const { validateReserveFlight } = require('./flights.validation');
const { validationErrors } = require('../../middlewares/validationErrors');
const { getPagination } = require('../../services/query');

async function httpGetFlights(req, res) {
    const { skip, limit } = getPagination(req.query)
    const flights = await getFlights(skip, limit);
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
    await postReservation(data)

    return res.status(200).json({ message: 'Flight Reserved Successfully' })
}

async function reserveFlightHelper(reservations, flight, user_id) {
    const classes = ['A', 'B', 'C']
    let overall_price = 0;
    reservations.forEach(reservation => {
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

module.exports = {
    httpGetFlights,
    httpGetFlight,
    httpReserveFlight
}