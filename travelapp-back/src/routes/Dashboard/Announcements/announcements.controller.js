const { getAnnouncements, postAnnouncement } = require("../../../models/announcements.model");
const { validationErrors } = require('../../../middlewares/validationErrors');
const { validatePostAnnouncement } = require("./announcements.validation");
const sendPushNotification = require('../../../services/notifications');
const { getAllDeviceTokens } = require("../../../models/users.model");

async function httpGetAllAnnouncements(req, res) {
    const announcements = await getAnnouncements();
    return res.status(200).json({
        data: announcements
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