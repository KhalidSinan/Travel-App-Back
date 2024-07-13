const { validateCreateOrganizedTrip, validateMakeDiscount, validateReviewOrganizedTrip, validateMakeOrganizedTripAnnouncement } = require('./organized-trips.validation')
const { validationErrors } = require('../../../middlewares/validationErrors');
const { postOrganizedtrip, getAllOrganizedTrips, getOneOrganizedTrip, makeDiscount, addReview } = require('../../../models/organized-trips.model');
const { getTrip } = require('../../../models/trips.model');
const { cancelTripHelper } = require('../Trips/trips.helper');
const { getOrganizedTripReservationsForUserInTrip } = require('../../../models/organized-trip-reservations.model');
const { postAnnouncementRequest } = require('../../../models/announcement-requests.model');

// Serializer
async function httpGetAllOrganizedTrips(req, res) {
    const trips = await getAllOrganizedTrips();
    return res.status(200).json({ data: trips })
}

// Serializer
async function httpGetOneOrganizedTrip(req, res) {
    const trip = await getOneOrganizedTrip(req.params.id);
    if (!trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    return res.status(200).json({ data: trip })
}

// Need to know price logic
async function httpCreateOrganizedTrip(req, res) {
    const { error } = validateCreateOrganizedTrip(req.body);
    if (error) return res.status(404).json({ errors: validationErrors(error.details) })

    // Num of seats and overall prcie from trip_id
    const trip = await getTrip(req.body.trip_id)
    if (!trip) res.status(200).json({ message: 'Trip Not Found' })

    let price = trip.price_per_person + trip.price_per_person * (req.body.commission / 100)
    let data = { overall_seats: trip.num_of_people, available_seats: trip.num_of_people, price: price }
    Object.assign(data, req.body)
    await postOrganizedtrip(data)
    return res.status(200).json({ message: 'Organized Trip Created Successfully' })
}

// Serializer
async function httpGetMyOrganizedTrips(req, res) {
    let data = await getAllOrganizedTrips()
    data = data.filter(trip => trip.trip_id.user_id == req.user.id)
    return res.status(200).json({ message: 'Your Organized Trips Retrieved Successfully', data: data })
}

// Done
async function httpMakeDiscountOrganizedTrip(req, res) {
    const { error } = validateMakeDiscount(req.body)
    if (error) return res.status(404).json({ errors: validationErrors(error.details) })

    const trip = await getOneOrganizedTrip(req.params.id);
    if (!trip) return res.status(400).json({ message: 'Organized Trip Not Found' })

    await makeDiscount(trip, req.body.discount);
    return res.status(200).json({ message: `Discount of ${req.body.discount}% has been made` })
}

async function httpCancelOrganizedTrip(req, res) {
    const organized_trip = await getOneOrganizedTrip(req.params.id);
    if (!organized_trip) return res.status(400).json({ message: 'Organized Trip Not Found' })

    const trip = await getTrip(organized_trip.trip_id)
    if (!trip.user_id.equals(req.user.id)) return res.status(400).json({ message: 'No Access to this trip' })

    await cancelTripHelper(trip, trip.id)
    return res.status(200).json({ message: `Organized Trip Cancelled` })
}

async function httpReviewOrganizedTrip(req, res) {
    const { error } = validateReviewOrganizedTrip(req.body)
    if (error) return res.status(404).json({ errors: validationErrors(error.details) })

    const trip = await getOneOrganizedTrip(req.params.id);
    if (!trip) return res.status(400).json({ message: 'Organized Trip Not Found' })

    // check if user went on the trip
    const check = await getOrganizedTripReservationsForUserInTrip(req.user.id, req.params.id)
    if (check.length == 0) return res.status(200).json({ message: 'Cant Review A Trip You Havent Reserved In' })

    await addReview(req.user.id, req.body.stars, trip)
    return res.status(200).json({ message: 'Trip Reviewed Successfully' })
}

async function httpMakeOrganizedTripAnnouncement(req, res) {
    const { error } = validateMakeOrganizedTripAnnouncement(req.body)
    if (error) return res.status(404).json({ errors: validationErrors(error.details) })

    const organized_trip = await getOneOrganizedTrip(req.params.id);
    if (!organized_trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    const trip = await getTrip(organized_trip.trip_id)
    if (!trip.user_id.equals(req.user.id)) return res.status(400).json({ message: 'No Access to this trip' })

    // postAnnouncemetRequest
    const data = {
        organized_trip_id: req.params.id,
        organizer_id: req.user.id
    }
    Object.assign(data, req.body)
    await postAnnouncementRequest(data)
    return res.status(200).json({ message: 'Announcement Requested Successfully' })
}

module.exports = {
    httpGetAllOrganizedTrips,
    httpGetOneOrganizedTrip,
    httpCreateOrganizedTrip,
    httpGetMyOrganizedTrips,
    httpMakeDiscountOrganizedTrip,
    httpCancelOrganizedTrip,
    httpReviewOrganizedTrip,
    httpMakeOrganizedTripAnnouncement
}