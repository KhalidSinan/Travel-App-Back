const { postAnnouncement, getAnnouncementsApp, getAnnouncementsCountApp, getAnnouncementsOrganizer, getAnnouncementsCountOrganizer } = require("../../../models/announcements.model");
const { validationErrors } = require('../../../middlewares/validationErrors');
const { validatePostAnnouncement } = require("./announcements.validation");
const sendPushNotification = require('../../../services/notifications');
const { getAllDeviceTokens } = require("../../../models/users.model");
const { announcementData, announcementOrganizerData, announcementAppData } = require("./announcements.serializer");
const { serializedData } = require('../../../services/serializeArray')
const { getPagination } = require('../../../services/query');
const { filterAnnouncementsHelper } = require("./announcements.helper");
const { convertDateStringToDate } = require("../../../services/convertTime");

async function httpGetAllAnnouncementsApp(req, res) {
    req.query.limit = 10
    const { skip, limit } = getPagination(req.query)
    let filter = {}
    filter = filterAnnouncementsHelper(req.query)
    const announcements = await getAnnouncementsApp(skip, limit, req.query.sort, filter);
    const announcementsCount = await getAnnouncementsCountApp(filter);
    return res.status(200).json({
        data: serializedData(announcements, announcementAppData),
        count: announcementsCount
    })
}

async function httpGetAllAnnouncementsOrganizer(req, res) {
    req.query.limit = 10
    const { skip, limit } = getPagination(req.query)
    let filter = {}
    filter = filterAnnouncementsHelper(req.query)
    const announcements = await getAnnouncementsOrganizer(skip, limit, req.query.sort, filter);
    const announcementsCount = await getAnnouncementsCountOrganizer(filter);
    return res.status(200).json({
        data: serializedData(announcements, announcementOrganizerData),
        count: announcementsCount
    })
}

async function httpPostAnnouncement(req, res) {
    const { error } = validatePostAnnouncement(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    // Saving Announcement in DB
    let data = req.body;
    Object.assign(data, { expiry_date: convertDateStringToDate(req.body.expiry_date) })
    const announcement = await postAnnouncement(data);
    // Sending Notification For Announcements
    let tokens = await getAllDeviceTokens();
    //await sendPushNotification(req.body.title, req.body.body, tokens)

    return res.status(200).json({
        message: 'Announcement Sent',
        data: announcement
    })
}


module.exports = {
    httpGetAllAnnouncementsApp,
    httpGetAllAnnouncementsOrganizer,
    httpPostAnnouncement
}