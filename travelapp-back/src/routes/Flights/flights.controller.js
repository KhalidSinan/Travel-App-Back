const { getFlights, getFlight } = require('../../models/flights.model')
const { postReservation, getReservation, putConfirmation, removeReservation } = require('../../models/plane-reservation.model');
const { validateReserveFlight, validateConfirmFlight, validateGetFlights, validateGetFlight } = require('./flights.validation');
const { validationErrors } = require('../../middlewares/validationErrors');
const { getPagination } = require('../../services/query');
const { getWallet, putWallet } = require('../../models/users.model')
const { convertTime12to24 } = require('../../services/convertTime');
const { reservationData, flightData, twoWayFlightData, twoWayFlightDataDetails, flightDataDetails } = require('./flights.serializer');
const { serializedData } = require('../../services/serializeArray');

// Done
async function httpGetFlights(req, res) {
    const { error } = await validateGetFlights({ source: req.query.source, destination: req.query.destination, date: req.query.date, num_of_seats: req.query.num_of_seats, class_of_seats: req.query.class_of_seats })
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const { skip, limit } = getPagination(req.query)
    const filter = { 'departure_date.date': req.query.date, 'source.country': req.query.source, 'destination.country': req.query.destination }

    const source = req.query.source
    const destination = req.query.destination
    const num_of_seats = req.query.num_of_seats
    const class_of_seats = req.query.class_of_seats
    const sort = req.query.sort
    const type = req.query.type
    const date_end = req.query.date_end
    let date = req.query.date
    const airline = req.query.airline
    let time_start = req.query.time_start
    let time_end = req.query.time_end

    // To Stop Duplicate
    delete req.query.skip
    delete req.query.limit
    delete req.query.date
    delete req.query.source
    delete req.query.destination
    delete req.query.class_of_seats
    delete req.query.num_of_seats
    delete req.query.sort
    delete req.query.type
    delete req.query.date_end
    delete req.query.airline
    delete req.query.time_start
    delete req.query.time_end


    // Put req.query into filter
    Object.assign(filter, req.query)

    const classes = ['A', 'B', 'C']
    const flights = await getFlights(skip, limit, filter);
    let data = []

    flights.forEach(flight => {
        if (flight && flight.classes[classes.indexOf(class_of_seats)].available_seats >= num_of_seats) {
            flight.price = flight.classes[classes.indexOf(class_of_seats)].price
            data.push(flight)
            if (airline && flight.airline.name != airline) data.pop()
        }
    })

    if (time_start && time_end) {
        // Start Time
        const date1 = new Date(date)
        date1.setTime(date1.valueOf() + 3 * 60 * 60 * 1000) // To Fix Timezones
        time_start = convertTime12to24(time_start)
        date1.setUTCHours(time_start[0], time_start[1], time_start[2])

        // End Time
        const date2 = new Date(date)
        date2.setTime(date2.valueOf() + 3 * 60 * 60 * 1000) // To Fix Timezones
        time_end = convertTime12to24(time_end)
        date2.setUTCHours(time_end[0], time_end[1], time_end[2])

        // Converting to ms
        time_start = date1.valueOf()
        time_end = date2.valueOf()

        // Finding flights based on time
        let temp = []
        data.forEach(flight => {
            const flight_date = new Date(flight.departure_date.date)
            flight_date.setTime(flight_date.valueOf() + 3 * 60 * 60 * 1000) // To Fix Timezones
            const time = convertTime12to24(flight.departure_date.time)
            flight_date.setUTCHours(time[0], time[1], time[2])
            if (flight_date.valueOf() < time_end && flight_date.valueOf() > time_start) temp.push(flight)
        })
        data = temp;
    }

    // Two-Way
    if (type == 'Two-Way') {
        const filter_back = { 'departure_date.date': date_end, 'source.country': destination, 'destination.country': source }
        Object.assign(filter_back, req.query)
        const flights_back = await getFlights(skip, limit, filter_back);
        // Add Flights Together
        let two_way = [];
        flights.forEach(flight => {
            flights_back.forEach(flight_back => {
                let temp = { flight, flight_back }
                if (flight.classes[classes.indexOf(class_of_seats)].available_seats >= num_of_seats
                    && flight_back.classes[classes.indexOf(class_of_seats)].available_seats >= num_of_seats
                ) {
                    temp.flight_back.price = flight_back.classes[classes.indexOf(class_of_seats)].price
                    temp.overall_price = (flight_back.price + flight.price).toFixed(2)
                    two_way.push(temp)
                    if (airline && (flight.airline.name != airline && flight_back.airline.name != airline)) two_way.pop()
                }
            })
        })
        data = two_way
        if (sort) data.sort((a, b) => (a.flight.price + a.flight_back.price) - (b.flight.price + b.flight_back.price))
        if (sort == 'desc') {
            data.reverse();
        }

        return res.status(200).json({ data: serializedData(data, twoWayFlightData) })
    }

    if (sort) data.sort((a, b) => a.price - b.price)
    if (sort == 'desc') {
        data.reverse();
    }

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

// Maybe Disabled Person
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

// Done
async function findCancelRate(reservation, person_price) {
    const date = new Date(reservation.flight_id[0].departure_date.date)
    date.setTime(date.valueOf() + 3 * 60 * 60 * 1000) // To Fix Timezones
    const time = convertTime12to24(reservation.flight_id[0].departure_date.time)
    date.setUTCHours(time[0], time[1], time[2])
    const timeDifference = date - Date.now()
    const chance = 2 * 60 * 60 * 1000
    let rate = 0.2; // 0.2 will be back
    if (timeDifference < chance) rate = 0; // Nothing is back
    return person_price * rate
}

module.exports = {
    httpGetFlights,
    httpGetFlight,
    httpReserveFlight,
    httpGetReservation,
    httpConfirmReservation,
    httpCancelReservation,
}