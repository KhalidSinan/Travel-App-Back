const { validationErrors } = require("../../../middlewares/validationErrors")
const { getOrganizedTripReservationsForUser, getOrganizedTripReservationsForOneTrip, postOrganizedTripReservation } = require("../../../models/organized-trip-reservations.model")
const { getOneOrganizedTrip, decrementSeats } = require("../../../models/organized-trips.model")
const { getReservation, putReservationData } = require("../../../models/plane-reservation.model")
const { getTrip } = require("../../../models/trips.model")
const { validateReserveTrip } = require("./organized-trip-reservations.validation")

// Done
async function httpMakeReservation(req, res) {
    const { error } = validateReserveTrip(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const organized_trip = await getOneOrganizedTrip(req.params.id);
    if (!organized_trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    // if (organized_trip.available_seats <= 0) return res.status(400).json({ message: 'Organized Trip Full' })

    const data = {
        user_id: req.user.id,
        num_of_people: req.body.num_of_people,
        reservation_data: req.body.reservation_data,
        overall_price: req.body.num_of_people * organized_trip.price,
        trip_id: req.params.id
    }

    // Get flights
    const organized = await getOneOrganizedTrip(req.params.id);
    const trip = await getTrip(organized.trip_id)
    const flights = trip.flights

    await decrementSeats(organized_trip, req.body.num_of_people);
    await postOrganizedTripReservation(data)

    flights.forEach(async flight => {
        const reservation_data = await getReservation(flight)
        req.body.reservation_data.forEach(reservation => {
            const data = reservation_data.reservations.data.find(reservation => reservation.person_name == 'Default')
            if (data) {
                data.person_name = reservation.name
                data.person_passport = reservation.passport_number
            }
        })
        await putReservationData(flight, reservation_data.reservations.data)
    })
    return res.status(200).json({ message: 'Reserved Successfully' })
}

// Serializers Needed For All 3 Below

// User Gets all organized trips reservations
async function httpGetMyReservationsUser(req, res) {
    const user = req.user
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    const reservations = await getOrganizedTripReservationsForUser(user.id);
    return res.status(200).json({
        data: reservations,
    })
}

// Organizer gets all reservations for his trip
async function httpGetAllReservationsForTrip(req, res) {
    const user = req.user
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    // if (!trip.user_id.equals(user.id)) return res.status(400).json({ message: 'No Access To This Trip' })

    const reservations = await getOrganizedTripReservationsForOneTrip(req.params.id);
    return res.status(200).json({
        data: reservations
    })
}

// User gets all reservations for one trip
async function httpGetMyReservationsForTrip(req, res) {
    const user = req.user
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    const reservations = await getOrganizedTripReservationsForUser(user.id, req.params.id);
    return res.status(200).json({
        data: reservations,
    })
}

module.exports = {
    httpMakeReservation,
    httpGetMyReservationsUser,
    httpGetAllReservationsForTrip,
    httpGetMyReservationsForTrip
}