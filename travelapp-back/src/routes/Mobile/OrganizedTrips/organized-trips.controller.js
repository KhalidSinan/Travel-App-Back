const { validateCreateOrganizedTrip } = require('./organized-trips.validation')
const { validationErrors } = require('../../../middlewares/validationErrors');
const { postOrganizedtrip, getAllOrganizedTrips, getOneOrganizedTrip } = require('../../../models/organized-trips.model');
const { getTrip } = require('../../../models/trips.model');

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

    // Num of seats and overall prcie from trip_id
    const trip = await getTrip(trip_id)
    if (!trip) res.status(200).json({ message: 'Trip Not Found' })

    let data = { available_seats: trip.num_of_people, price: trip.overall_price * req.body.commission }
    Object.assign(data, req.body)
    await postOrganizedtrip(data)
    return res.status(200).json({ message: 'Organized Trip Created Successfully' })
}

module.exports = {
    httpGetAllOrganizedTrips,
    httpGetOneOrganizedTrip,
    httpCreateOrganizedTrip
}