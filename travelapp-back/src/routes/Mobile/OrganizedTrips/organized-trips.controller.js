const { validateCreateOrganizedTrip, validateReviewOrganizedTrip, validateMakeOrganizedTripAnnouncement } = require('./organized-trips.validation')
const { validationErrors } = require('../../../middlewares/validationErrors');
const { postOrganizedtrip, getAllOrganizedTrips, getOneOrganizedTrip, deleteOrganizedTrip } = require('../../../models/organized-trips.model');
const { getTrip } = require('../../../models/trips.model');
const { cancelTripHelper } = require('../Trips/trips.helper');
const { getOrganizedTripReservationsForUserInTrip, getOrganizedTripReservationsForOneTrip, deleteOrganizedTripReservations } = require('../../../models/organized-trip-reservations.model');
const { getOrganizedTrips, getOrganizedTripDetails, getOrganizedTripScheduleDetails, myOrganizedTripsData } = require('./organized-trips.serializer');
const { serializedData } = require("../../../services/serializeArray");
const { getAllOrganizedByCountry, getFilterForOrganizedTrips, filterOrganizedTrips, filterOrganizedTripsShown, removeOldOrganizedTrips, calculateAnnouncementOptions, assignTypesToOrganizedTrips, putTypeChosenFirst, putDestinationsChosenFirst, getDeviceTokensForUsersInOrganizedTrip } = require('./organized-trips.helper');
const { getPagination } = require('../../../services/query');
const { getCountriesWithContinents, getCountries } = require('../../../services/locations');
const { getOrganizerID, rateOrganizer, getOrganizer } = require('../../../models/organizers.model');
const sendPushNotification = require('../../../services/notifications');
const { getUserById } = require('../../../models/users.model');
const { postNotification } = require('../../../models/notification.model');

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
    trips = putDestinationsChosenFirst(trips, filterDestinations)
    const allLength = trips.length
    trips = trips.slice(skip, skip + limit)
    return res.status(200).json({
        data: serializedData(trips, getOrganizedTrips),
        count: allLength
    })
}

async function httpGetOneOrganizedTrip(req, res) {
    const trip = await getOneOrganizedTrip(req.params.id);
    if (!trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    const reservations = await getOrganizedTripReservationsForOneTrip(trip._id)
    trip.reservations = reservations
    return res.status(200).json({ data: getOrganizedTripDetails(trip) })
}

async function httpGetOneOrganizedTripSchedule(req, res) {
    const trip = await getOneOrganizedTrip(req.params.id);
    if (!trip) return res.status(400).json({ message: 'Organized Trip Not Found' })

    return res.status(200).json({ data: serializedData(trip.trip_id.destinations, getOrganizedTripScheduleDetails) })
}

// Done
async function httpCreateOrganizedTrip(req, res) {
    const { error } = validateCreateOrganizedTrip(req.body);
    if (error) return res.status(404).json({ errors: validationErrors(error.details) })

    const trip = await getTrip(req.body.trip_id)
    if (!trip) res.status(200).json({ message: 'Trip Not Found' })

    let price = trip.price_per_person + req.body.commission
    let organizer_id = await getOrganizerID(req.user._id)
    let data = { organizer_id, overall_seats: trip.num_of_people, available_seats: trip.num_of_people, price: price }
    Object.assign(data, req.body)
    const organized_trip = await postOrganizedtrip(data)
    return res.status(200).json({ message: 'Organized Trip Created Successfully', data: organized_trip._id })
}

async function httpGetMyOrganizedTrips(req, res) {
    let data = await getAllOrganizedTrips()
    data = data.filter(trip => trip.trip_id.user_id.equals(req.user.id))
    return res.status(200).json({ message: 'Your Organized Trips Retrieved Successfully', data: serializedData(data, myOrganizedTripsData) })
}

async function httpCancelOrganizedTrip(req, res) {
    const organized_trip = await getOneOrganizedTrip(req.params.id);
    if (!organized_trip) return res.status(400).json({ message: 'Organized Trip Not Found' })

    const trip = await getTrip(organized_trip.trip_id)
    if (!trip.user_id.equals(req.user.id)) return res.status(400).json({ message: 'No Access to this trip' })

    const reservations = await getOrganizedTripReservationsForOneTrip(organized_trip._id)
    const device_tokens = await getDeviceTokensForUsersInOrganizedTrip(reservations)
    const organizer = await getUserById(trip.user_id)
    const notificationData = {
        organizer_name: organizer[0].name.first_name + ' ' + organizer[0].name.last_name,
        source: trip.starting_place.city,
        destinations: trip.destinations.map(dest => dest.city_name),
        start_date: trip.start_date.toLocaleDateString('en-GB')
    }
    await sendPushNotification('Organized Trip Cancelled', 'Your Organized Trip has been Cancelled', device_tokens, '/cancel-organized-group-screen', notificationData)
    for (const reservation of reservations) {
        const user_id = reservation.user_id;
        await postNotification({
            user_id,
            notification_title: 'Organized Trip Cancelled',
            notification_body: 'Your Organized Trip has been Cancelled',
        })
    }

    await deleteOrganizedTripReservations(organized_trip._id)
    await cancelTripHelper(trip, trip.id)
    await deleteOrganizedTrip(req.params.id)
    return res.status(200).json({ message: 'Organized Trip Cancelled' })
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

async function httpRateOrganizer(req, res) {
    const { error } = validateReviewOrganizedTrip(req.body)
    if (error) return res.status(404).json({ errors: validationErrors(error.details) })

    const trip = await getOneOrganizedTrip(req.params.id);
    if (!trip) return res.status(400).json({ message: 'Organized Trip Not Found' })

    // check if user went on the trip
    const check = await getOrganizedTripReservationsForUserInTrip(req.user.id, req.params.id)
    if (check.length == 0) return res.status(400).json({ message: 'Cant Rate An Organizer You Havent Reserved With' })

    const organizer = await getOrganizer(trip.organizer_id)
    let rating = (organizer.rating + req.body.rating) / 2
    await rateOrganizer(trip.organizer_id, rating)
    return res.status(200).json({ message: 'Organizer  Successfully' })
}

module.exports = {
    httpGetAllOrganizedTrips,
    httpGetOneOrganizedTrip,
    httpCreateOrganizedTrip,
    httpGetMyOrganizedTrips,
    httpCancelOrganizedTrip,
    httpGetCountriesWithContinents,
    httpGetCountries,
    httpGetOneOrganizedTripSchedule,
    httpRateOrganizer
}