const { validateCreateOrganizedTrip, validateMakeDiscount, validateReviewOrganizedTrip, validateMakeOrganizedTripAnnouncement } = require('./organized-trips.validation')
const { validationErrors } = require('../../../middlewares/validationErrors');
const { postOrganizedtrip, getAllOrganizedTrips, getOneOrganizedTrip, makeDiscount, addReview } = require('../../../models/organized-trips.model');
const { getTrip } = require('../../../models/trips.model');
const { cancelTripHelper } = require('../Trips/trips.helper');
const { getOrganizedTripReservationsForUserInTrip, getOrganizedTripReservationsForOneTrip } = require('../../../models/organized-trip-reservations.model');
const { postAnnouncementRequest } = require('../../../models/announcement-requests.model');
const { getOrganizerID } = require('../../../models/organizers.model');
const { getOrganizedTrips, getOrganizedTripDetails } = require('./organized-trips.serializer');
const { serializedData } = require("../../../services/serializeArray");
const { getAllOrganizedByCountry, getFilterForOrganizedTrips, filterOrganizedTrips, filterOrganizedTripsShown, removeOldOrganizedTrips, calculateAnnouncementOptions, assignTypesToOrganizedTrips, putTypeChosenFirst } = require('./organized-trips.helper');
const { getPagination } = require('../../../services/query');
const { getCountriesWithContinents, getCountries } = require('../../../services/locations');

// Serializer
async function httpGetAllOrganizedTrips(req, res) {
    // make validation
    req.query.limit = 10
    const { skip, limit } = getPagination(req.query)
    const starting_country = req.body.starting_country ?? null;
    const { filterPrice, filterDate, filterType, filterDestinations } = req.body
    let filter = getFilterForOrganizedTrips(filterType, filterPrice)
    let trips = await getAllOrganizedTrips(filter);
    trips = removeOldOrganizedTrips(trips)
    trips = getAllOrganizedByCountry(trips, starting_country)
    trips = filterOrganizedTrips(trips, filterDate, filterDestinations)
    trips = await assignTypesToOrganizedTrips(trips)
    trips = filterOrganizedTripsShown(trips, req.body.organizedTripsShown)
    trips = putTypeChosenFirst(trips, filterType)
    const allLength = trips.length
    trips = trips.slice(skip, skip + limit)
    return res.status(200).json({
        data: serializedData(trips, getOrganizedTrips),
        count: allLength
    })
}

// Serializer
async function httpGetOneOrganizedTrip(req, res) {
    const trip = await getOneOrganizedTrip(req.params.id);
    if (!trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    const reservations = await getOrganizedTripReservationsForOneTrip(trip._id)
    trip.reservations = reservations
    return res.status(200).json({ data: getOrganizedTripDetails(trip) })
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
    data = data.filter(trip => trip.trip_id.user_id.equals(req.user.id))
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

async function httpGetOrganizedTripAnnouncementOption(req, res) {
    const organized_trip = await getOneOrganizedTrip(req.params.id);
    if (!organized_trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    const trip = await getTrip(organized_trip.trip_id)
    if (!trip.user_id.equals(req.user.id)) return res.status(400).json({ message: 'No Access to this trip' })

    const options = calculateAnnouncementOptions(organized_trip.trip_id)
    return res.status(200).json({ message: 'Announcement Option Retreieved Successfully', options })
}

async function httpMakeOrganizedTripAnnouncement(req, res) {
    const { error } = validateMakeOrganizedTripAnnouncement(req.body)
    if (error) return res.status(404).json({ errors: validationErrors(error.details) })

    const organized_trip = await getOneOrganizedTrip(req.params.id);
    if (!organized_trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    const trip = await getTrip(organized_trip.trip_id)
    if (!trip.user_id.equals(req.user.id)) return res.status(400).json({ message: 'No Access to this trip' })

    const organizer_id = await getOrganizerID(req.user.id)
    // postAnnouncemetRequest
    const data = {
        organized_trip_id: req.params.id,
        organizer_id: organizer_id._id
    }
    Object.assign(data, req.body)
    await postAnnouncementRequest(data)
    return res.status(200).json({ message: 'Announcement Requested Successfully' })
}

function httpGetCountriesWithContinents(req, res) {
    const countries = getCountriesWithContinents()
    return res.status(200).json({
        data: countries
    })
}

function httpGetCountries(req, res) {
    const countries = getCountries()
    return res.status(200).json({
        data: countries
    })
}

module.exports = {
    httpGetAllOrganizedTrips,
    httpGetOneOrganizedTrip,
    httpCreateOrganizedTrip,
    httpGetMyOrganizedTrips,
    httpMakeDiscountOrganizedTrip,
    httpCancelOrganizedTrip,
    httpReviewOrganizedTrip,
    httpMakeOrganizedTripAnnouncement,
    httpGetOrganizedTripAnnouncementOption,
    httpGetCountriesWithContinents,
    httpGetCountries
}