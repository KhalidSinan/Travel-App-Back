const { getAnnouncements, postAnnouncement, getAnnouncementsCount } = require("../../../models/announcements.model");
const { validationErrors } = require('../../../middlewares/validationErrors');
const { validatePostAnnouncement } = require("./announcements.validation");
const sendPushNotification = require('../../../services/notifications');
const { getAllDeviceTokens } = require("../../../models/users.model");
const { announcementData } = require("./announcements.serializer");
const { serializedData } = require('../../../services/serializeArray')
const { getPagination } = require('../../../services/query');
const { filterAnnouncementsHelper } = require("./announcements.helper");

async function httpGetAllAnnouncements(req, res) {
    req.query.limit = 10
    const { skip, limit } = getPagination(req.query)
    let filter = {}
    filter = filterAnnouncementsHelper(req.query)
    const announcements = await getAnnouncements(skip, limit, req.query.sort, filter);
    const announcementsCount = await getAnnouncementsCount();
    return res.status(200).json({
        data: serializedData(announcements, announcementData),
        count: announcementsCount
    })
}

async function httpPostAnnouncement(req, res) {
    const { error } = validatePostAnnouncement(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    // Saving Announcement in DB
    const announcement = await postAnnouncement(req.body);

    // Sending Notification For Announcements
    let tokens = await getAllDeviceTokens();
    //await sendPushNotification(req.body.title, req.body.body, tokens)

    return res.status(200).json({
        message: 'Announcement Sent',
        data: announcement
    })
}


module.exports = {
    httpGetAllAnnouncements,
    httpPostAnnouncement
}