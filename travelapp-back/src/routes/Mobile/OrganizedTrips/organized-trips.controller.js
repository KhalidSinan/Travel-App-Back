const { validateCreateOrganizedTrip } = require('./organized-trips.validation')
const { validationErrors } = require('../../../middlewares/validationErrors');
const { postOrganizedtrip, getAllOrganizedTrips, getOneOrganizedTrip } = require('../../../models/organized-trips.model');

async function httpGetAllOrganizedTrips(req, res) {
    const trips = await getAllOrganizedTrips();
    return res.status(200).json({ data: trips })
}

async function httpGetOneOrganizedTrip(req, res) {
    const trip = await getOneOrganizedTrip(req.params.id);
    if (!trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    return res.status(200).json({ data })
}

async function httpCreateOrganizedTrip(req, res) {
    const { error } = validateCreateOrganizedTrip(req.body);
    if (error) return res.status(404).json({ errors: validationErrors(error.details) })

    let data = { available_seats: req.body.overall_seats }
    Object.assign(data, req.body)
    await postOrganizedtrip(data)
    return res.status(200).json({ message: 'Organized Trip Created Successfully' })
}

module.exports = {
    httpGetAllOrganizedTrips,
    httpGetOneOrganizedTrip,
    httpCreateOrganizedTrip
}