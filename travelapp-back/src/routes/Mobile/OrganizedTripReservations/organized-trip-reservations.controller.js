const { validationErrors } = require("../../../middlewares/validationErrors")
const { getOrganizedTripReservationsForUser, getOrganizedTripReservationsForOneTrip, postOrganizedTripReservation, getOrganizedTripReservation, updateReservationData, updateReservationDataOverallPrice } = require("../../../models/organized-trip-reservations.model")
const { getOneOrganizedTrip, decrementSeats, incrementSeats } = require("../../../models/organized-trips.model")
const { getReservation, putReservationData } = require("../../../models/plane-reservation.model")
const { getTrip } = require("../../../models/trips.model")
const { organizedTripReservationData, organizedTripReservationDetails, organizedTripReservationDetailsForUser } = require("./organized-trip-reservations.serializer")
const { validateReserveTrip, validateCancelReservation } = require("./organized-trip-reservations.validation")
const { serializedData } = require("../../../services/serializeArray");
const getReservationDataForTripHelper = require("./organized-trip-reservations.helper")

// Done
async function httpMakeReservation(req, res) {
    const { error } = validateReserveTrip(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const organized_trip = await getOneOrganizedTrip(req.params.id);
    if (!organized_trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    if (organized_trip.available_seats <= 0) return res.status(400).json({ message: 'Organized Trip Full' })

    req.body.reservation_data.forEach(data => {
        data.price = organized_trip.price
    })
    const data = {
        user_id: req.user.id,
        num_of_people: req.body.num_of_people,
        reservation_data: req.body.reservation_data,
        overall_price: req.body.num_of_people * organized_trip.price,
        trip_id: req.params.id
    }

    // Get flights
    const trip = await getTrip(organized_trip.trip_id)
    const flights = trip.flights

    await decrementSeats(organized_trip, req.body.num_of_people);
    await postOrganizedTripReservation(data)

    flights.forEach(async flight => {
        const reservation_data = await getReservation(flight)
        if (reservation_data) {
            req.body.reservation_data.forEach(reservation => {
                const data = reservation_data.reservations.data.find(reservation => reservation.person_name == 'Default')
                if (data) {
                    data.person_name = reservation.name
                    data.person_passport = reservation.passport_number
                }
            })
            await putReservationData(flight, reservation_data.reservations.data)
        }
    })
    return res.status(200).json({ message: 'Reserved Successfully' })
}


// User Gets all organized trips reservations
async function httpGetMyReservationsUser(req, res) {
    const user = req.user
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    const reservations = await getOrganizedTripReservationsForUser(user.id);
    return res.status(200).json({
        data: serializedData(reservations, organizedTripReservationData),
    })
}

// Organizer gets all reservations for his trip
async function httpGetAllReservationsForTrip(req, res) {
    const user = req.user
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    const organized_trip = await getOneOrganizedTrip(req.params.id)
    if (!organized_trip) {
        return res.status(404).json({ message: 'Organized Trip Not found' });
    }
    const trip = await getTrip(organized_trip.trip_id)
    if (!trip) return res.status(404).json({ message: 'Trip Not Found' });

    if (!trip.user_id.equals(user.id)) return res.status(400).json({ message: 'No Access To This Trip' })

    let reservations = await getOrganizedTripReservationsForOneTrip(req.params.id);
    reservations = getReservationDataForTripHelper(reservations)
    return res.status(200).json({
        data: serializedData(reservations, organizedTripReservationDetails)
    })
}

// User gets all reservations for one trip
async function httpGetMyReservationsForTrip(req, res) {
    const user = req.user
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    let reservations = await getOrganizedTripReservationsForUser(user.id, req.params.id);
    reservations = getReservationDataForTripHelper(reservations)
    return res.status(200).json({
        data: serializedData(reservations, organizedTripReservationDetailsForUser),
    })
}

async function httpCancelReservation(req, res) {
    const { error } = validateCancelReservation(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const reservation_data = await getOrganizedTripReservation(req.params.id);
    const organized_trip = await getOneOrganizedTrip(reservation_data.trip_id)
    const trip = await getTrip(organized_trip.trip_id)
    let increment = 0;
    let price = 0;
    let reservation_data_new = []
    const reservations = req.body.reservations
    reservations.forEach(reservation => {
        const temp = reservation_data.reservation_data.find(res => res._id == reservation)
        if (temp) {
            reservation_data.reservation_data.remove(temp)
            reservation_data_new.push(temp.name)
            increment++;
            price += temp.price
        }
    })
    // price = reservation_data.overall_price - price
    const flights = trip.flights
    flights.forEach(async flight => {
        const reservation_data = await getReservation(flight)
        if (reservation_data) {
            reservation_data_new.forEach(newData => {
                const data = reservation_data.reservations.data.find(reservation => reservation.person_name == newData)
                if (data)
                    data.person_name = 'Default'
            })
            await putReservationData(flight, reservation_data.reservations.data)

        }
    })
    await updateReservationData(reservation_data, reservation_data.reservation_data)
    // await updateReservationDataOverallPrice(reservation_data, price)
    // await incrementSeats(organized_trip, increment)

    return res.status(200).json({
        message: "Reservation Cancelled"
    })
}



module.exports = {
    httpMakeReservation,
    httpGetMyReservationsUser,
    httpGetAllReservationsForTrip,
    httpGetMyReservationsForTrip,
    httpCancelReservation
}