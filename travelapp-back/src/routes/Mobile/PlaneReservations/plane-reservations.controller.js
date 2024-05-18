const createPaymentData = require('../../../services/payment');
const { getFlight } = require('../../../models/flights.model');
const { paymentSheet } = require('../Payments/payments.controller');
const { reservationData } = require('./plane-reservations.serializer');
const { validateReserveFlight } = require('./plane-reservations.validation');
const { reserveFlightHelper, findCancelRate, changeClassName } = require('./plane-reservations.helper')
const { postReservation, getReservation, putConfirmation, removeReservation, deleteReservation } = require('../../../models/plane-reservation.model');
const sendPushNotification = require('../../../services/notifications');
const { postNotification } = require('../../../models/notification.model');

// Done
async function httpMakeReservation(req, res) {
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
    if (reservations_back.length == 0) reservations_back = null
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
    if (!reservation) return res.status(400).json({ message: 'Reservation Not Found' })
    const user_id = req.user._id
    if (!user_id.equals(reservation.user_id)) {
        return res.status(400).json({
            message: 'Cant Access This Reservation'
        })
    }
    await putConfirmation(reservation, true)

    //Notifications
    const title = 'Reservation Confirmed'
    const body = 'Reservation Has Been Confirmed'

    const tokens = req.user.device_token;
    // await sendPushNotification(title, body, tokens);
    await postNotification({ user_id, notification_title: title, notification_body: body, notification_identifier: reservation._id });

    return res.status(200).json({
        message: 'Reservation Confirmed'
    })
}

// Done
async function httpCancelReservation(req, res) {
    const reservation = await getReservation(req.params.id)
    if (!reservation) return res.status(400).json({ message: 'Reservation Not Found' })

    const user_id = req.user._id
    if (!user_id.equals(reservation.user_id)) {
        return res.status(400).json({
            message: 'Cant Access This Reservation'
        })
    }

    const id = req.body.person_id;
    let person_reservation = reservation.reservations.data.find(res => res._id.equals(id))
    if (reservation.reservation_type == 'Two-Way' && !person_reservation) {
        person_reservation = reservation.reservations_back.data.find(res => res._id.equals(id))
    }
    if (!person_reservation) {
        return res.status(200).json({
            message: 'Person Reservation Not Found'
        })
    }
    // const fee = await findCancelRate(reservation, person_reservation.price) // Money That Will Be Returned
    const length = await removeReservation(reservation, person_reservation)
    if (length == 0) await deleteReservation(reservation);

    //Notifications
    const title = "Reservation Cancelled"
    const body = `${person_reservation.person_name} Reservation Has Been Cancelled`

    const tokens = req.user.device_token;
    // await sendPushNotification(title, body, tokens);
    await postNotification({ user_id, notification_title: title, notification_body: body, notification_identifier: person_reservation._id });

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

// Done
async function httpGetReservation(req, res) {
    const reservation = await getReservation(req.params.id)
    const user_id = req.user._id
    if (!reservation) return res.status(400).json({ message: 'Reservation Not Found' })
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
async function httpPayReservation(req, res) {
    const reservation = await getReservation(req.params.id)
    if (!reservation) return res.status(400).json({ message: 'Reservation Not Found' })
    const data = reservation.reservations.data
    if (reservation.reservations_back.data.length > 0) data.push(...reservation.reservations_back.data)
    const payment_data = createPaymentData(data, reservation.overall_price, "flight")
    req.body.data = payment_data
    paymentSheet(req, res)
}

module.exports = {
    httpMakeReservation,
    httpConfirmReservation,
    httpCancelReservation,
    httpGetReservation,
    httpPayReservation
}