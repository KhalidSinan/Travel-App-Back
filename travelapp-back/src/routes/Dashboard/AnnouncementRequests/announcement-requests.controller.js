const { getAnnouncementRequest, getAnnouncementRequests, acceptAnnouncementRequest, denyAnnouncementRequest, getAnnouncementRequestsCount } = require('../../../models/announcement-requests.model')
const { postAnnouncementForOrganizer } = require('../../../models/announcements.model')
const { getPagination } = require('../../../services/query')
const { serializedData } = require('../../../services/serializeArray')
const { filterAnnouncementRequestsHelper } = require('./announcement-requests.helper')
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
    const data = await acceptAnnouncementRequest(req.params.id)
    await postAnnouncementForOrganizer({
        announcement_title: data.announcement_title,
        announcement_body: data.announcement_body,
        organized_trip_id: data.organized_trip_id,
        organizer_id: data.organizer_id,
        expiry_date: new Date(Date.now() + (1000 * 60 * 60 * 24 * 3))
    })
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