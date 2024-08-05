const { getAnnouncementRequest, getAnnouncementRequests, acceptAnnouncementRequest, denyAnnouncementRequest, getAnnouncementRequestsCount } = require('../../../models/announcement-requests.model')
const { postAnnouncementForOrganizer } = require('../../../models/announcements.model')
const { getOneOrganizedTrip } = require('../../../models/organized-trips.model')
const { getPagination } = require('../../../services/query')
const { serializedData } = require('../../../services/serializeArray')
const { filterAnnouncementRequestsHelper, calculatePriceForAnnouncement, expiryDateHelper } = require('./announcement-requests.helper')
const { announcementRequestData } = require('./announcement-requests.serializer')

async function httpGetAllAnnouncementRequests(req, res) {
    req.query.limit = 10
    const { skip, limit } = getPagination(req.query)
    let filter = {}
    filter = filterAnnouncementRequestsHelper(req.query)
    const data = await getAnnouncementRequests(skip, limit, req.query.sort, filter)
    const announcementRequestCount = await getAnnouncementRequestsCount(filter)
    return res.status(200).json({
        message: 'Announcement Requests Retrieved Successfully',
        data: serializedData(data, announcementRequestData),
        count: announcementRequestCount
    })
}

async function httpGetOneAnnouncementRequest(req, res) {
    const data = await getAnnouncementRequest(req.params.id)
    return res.status(200).json({
        message: 'Announcement Request Retrieved Successfully',
        data: data
    })
}

async function httpAcceptAnnouncementRequest(req, res) {
    const request = await getAnnouncementRequest(req.params.id)
    if (request.is_accepted) return res.status(200).json({ message: 'Announcement Request Already Accepted' })
    await acceptAnnouncementRequest(req.params.id)
    const trip = await getOneOrganizedTrip(request.organized_trip_id)
    const price = calculatePriceForAnnouncement(request.num_of_days, request.location, trip.trip_id)
    const expiry_date = expiryDateHelper(trip, request.num_of_days)
    const data = {
        announcement_title: request.announcement_title,
        announcement_body: request.announcement_body,
        organized_trip_id: request.organized_trip_id,
        organizer_id: request.organizer_id,
        location: request.location,
        price: price,
        expiry_date: expiry_date
    }
    await postAnnouncementForOrganizer(data)
    return res.status(200).json({
        message: 'Announcement Request Accepted Successfully',
        data: data
    })
}

async function httpDenyAnnouncementRequest(req, res) {
    const data = await denyAnnouncementRequest(req.params.id)
    return res.status(200).json({
        message: 'Announcement Request Denied Successfully',
        data: data
    })
}


module.exports = {
    httpGetAllAnnouncementRequests,
    httpGetOneAnnouncementRequest,
    httpAcceptAnnouncementRequest,
    httpDenyAnnouncementRequest,
}