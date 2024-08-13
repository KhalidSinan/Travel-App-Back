const { getAnnouncementsForHomePage } = require("../../../models/announcements.model");
const { announcementData } = require("./announcements.serializer");
const { serializedData } = require('../../../services/serializeArray')
const { postAnnouncementRequest } = require('../../../models/announcement-requests.model');
const { getOrganizerID } = require('../../../models/organizers.model');
const { getOneOrganizedTrip } = require("../../../models/organized-trips.model");
const { getTrip } = require("../../../models/trips.model");
const { calculateAnnouncementOptions, calculateAnnouncementPrice, generateAnnouncementData } = require("./announcements.helper");
const { validateMakeOrganizedTripAnnouncement } = require("../OrganizedTrips/organized-trips.validation");
const { validationErrors } = require('../../../middlewares/validationErrors')

async function httpGetAllAnnouncements(req, res) {
    const announcements = await getAnnouncementsForHomePage();
    return res.status(200).json({
        data: serializedData(announcements, announcementData),
    })
}

async function httpGetOrganizedTripAnnouncementOption(req, res) {
    const organized_trip = await getOneOrganizedTrip(req.params.id);
    if (!organized_trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    const trip = await getTrip(organized_trip.trip_id)
    if (!trip.user_id.equals(req.user.id)) return res.status(400).json({ message: 'No Access to this trip' })

    const options = generateAnnouncementData(organized_trip.trip_id)
    return res.status(200).json({ message: 'Announcement Option Retreieved Successfully', data: options })
}

async function httpMakeOrganizedTripAnnouncement(req, res) {
    const { error } = validateMakeOrganizedTripAnnouncement(req.body)
    if (error) return res.status(404).json({ errors: validationErrors(error.details) })

    const organized_trip = await getOneOrganizedTrip(req.params.id);
    if (!organized_trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    const trip = await getTrip(organized_trip.trip_id)
    if (!trip.user_id.equals(req.user.id)) return res.status(400).json({ message: 'No Access to this trip' })

    const organizer_id = await getOrganizerID(req.user.id)
    const price = calculateAnnouncementPrice(req.body.num_of_days, req.body.location, organized_trip)
    const data = {
        organized_trip_id: req.params.id,
        organizer_id: organizer_id._id,
        num_of_days: req.body.num_of_days,
        location: req.body.location,
        price: price
    }
    Object.assign(data, req.body)
    await postAnnouncementRequest(data)
    return res.status(200).json({ message: 'Announcement Requested Successfully' })
}

module.exports = {
    httpGetAllAnnouncements,
    httpMakeOrganizedTripAnnouncement,
    httpGetOrganizedTripAnnouncementOption,
}