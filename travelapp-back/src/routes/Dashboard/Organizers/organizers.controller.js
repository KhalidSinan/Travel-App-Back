const { deleteAccount, deactivateAccount, getDeviceTokens } = require("../../../models/users.model")
const { getPagination } = require('../../../services/query')
const { getOrganizer, getOrganizers, deleteOrganizerAccount, searchOrganizers, incrementWarnings, getOrganizersCount } = require("../../../models/organizers.model");
const { organizersData, organizerData, tripDetailsData } = require("./organizers.serializer");
const { serializedData } = require('../../../services/serializeArray');
const { searchOrganizersHelper } = require("./organizers.helper");
const sendPushNotification = require("../../../services/notifications");
const { validationErrors } = require("../../../middlewares/validationErrors");
const { validateAlertOrganizer } = require('./organizers.validation');
const { getAllOrganizedTrips } = require("../../../models/organized-trips.model");
const { getHotelReservationsWithDetails } = require("../../../models/hotel-reservation.model");
const { getAllPlaneReservations } = require("../../../models/plane-reservation.model");
const { getPlaces } = require("../../../models/places.model");

async function httpGetAllOrganizers(req, res) {
    req.query.limit = 6
    const { skip, limit } = getPagination(req.query)
    const organizers = await getOrganizers(skip, limit);
    const organizersCount = await getOrganizersCount()
    return res.status(200).json({ data: serializedData(organizers, organizersData), count: organizersCount })
}

async function httpGetOneOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    let data = await getAllOrganizedTrips()
    organizer.trips = data.filter(trip => trip.trip_id.user_id.equals(organizer.user_id._id))
    req.query.limit = 4
    const { skip, limit } = getPagination(req.query)
    const tripsCount = organizer.trips.length
    organizer.trips = organizer.trips.slice(skip, skip + limit)
    return res.status(200).json({ data: organizerData(organizer), count: tripsCount })
}

async function httpGetOneOrganizerTripDetails(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    let data = await getAllOrganizedTrips()
    organizer.trip = data.filter(trip => trip.trip_id.user_id.equals(organizer.user_id._id) && trip._id == req.params.id2)
    let trip = organizer.trip[0]
    trip.trip_id.hotels = await getHotelReservationsWithDetails(trip.trip_id.hotels);
    trip.trip_id.places_to_visit = await getPlaces(trip.trip_id.places_to_visit)
    trip.trip_id.flights = await getAllPlaneReservations(trip.trip_id.flights);
    return res.status(200).json({ data: tripDetailsData(trip) })
}

async function httpSearchOrganizers(req, res) {
    req.query.limit = 6;
    const { skip, limit } = getPagination(req.query)
    let organizers = await getOrganizers(0, 0);
    organizers = searchOrganizersHelper(organizers, req.query.name)
    const organizersCount = organizers.length
    organizers = organizers.slice(skip, skip + limit)
    return res.status(200).json({ data: serializedData(organizers, organizersData), count: organizersCount })
}

// Done
async function httpDeleteOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    await deleteAccount(organizer.user_id._id)
    await deleteOrganizerAccount(req.params.id)
    return res.status(200).json({ message: 'Organizer Account Deleted' });
}

// Done
async function httpDeactivateOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    await deactivateAccount(organizer.user_id._id)
    await deleteOrganizerAccount(req.params.id)
    return res.status(200).json({ message: 'Organizer Account Deactivated' });
}

async function httpAlertOrganizer(req, res) {
    const { error } = validateAlertOrganizer(req.body);
    if (error) return res.status(400).json({ message: validationErrors(error.details) });

    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })

    const tokens = await getDeviceTokens(organizer.user_id)
    // await sendPushNotification(req.body.title, req.body.body, tokens)

    await incrementWarnings(organizer)

    return res.status(200).json({ message: 'Organizer Has Been Alerted' });
}

module.exports = {
    httpGetAllOrganizers,
    httpGetOneOrganizer,
    httpDeleteOrganizer,
    httpSearchOrganizers,
    httpDeactivateOrganizer,
    httpAlertOrganizer,
    httpGetOneOrganizerTripDetails
}