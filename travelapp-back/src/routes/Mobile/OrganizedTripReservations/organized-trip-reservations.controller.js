const { validationErrors } = require("../../../middlewares/validationErrors")
const { getOrganizedTripReservations, getOrganizedTripReservationsForOneTrip, postOrganizedTripReservation } = require("../../../models/organized-trip-reservations.model")
const { getOneOrganizedTrip, decrementSeats } = require("../../../models/organized-trips.model")
const { validateReserveTrip } = require("./organized-trip-reservations.validation")

// Not Done
async function httpMakeReservation(req, res) {
    const { error } = validateReserveTrip(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const organized_trip = await getOneOrganizedTrip(req.body.id);
    if (!organized_trip) return res.status(400).json({ message: 'Organized Trip Not Found' })

    const data = {
        user_id: req.user._id,
        num_of_people: req.body.num_of_people,
        reservationData: {
            key: ["Name", "Passport", "price"],
        },
        overall_price: req.body.num_of_people * organized_trip.price
    }

    await decrementSeats(organized_trip, 4);
    await postOrganizedTripReservation(data)

    return res.status(200).json({ message: 'Reserved Successfully' })
}

async function httpGetMyReservations(req, res) {
    const user = req.user
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    const reservations = await getOrganizedTripReservations(user._id);
    return res.status(200).json({
        data: reservations,
    })
}
////////////////////

async function httpGetReservationsForTrip(req, res) {
    const user = req.user
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    const reservations = await getOrganizedTripReservationsForOneTrip(req.params.id);
    return res.status(200).json({
        data: reservations
    })
}

module.exports = {
    httpMakeReservation,
    httpGetMyReservations,
    httpGetReservationsForTrip
}