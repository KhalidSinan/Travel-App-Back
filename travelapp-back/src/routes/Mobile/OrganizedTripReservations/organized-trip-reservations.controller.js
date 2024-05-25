const { validationErrors } = require("../../../middlewares/validationErrors")
const { validateReserveTrip } = require("./organized-trip-reservations.validation")


async function httpMakeReservation(req, res) {
    const { error } = validateReserveTrip(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const data = {}
}

module.exports = {
    httpMakeReservation
}