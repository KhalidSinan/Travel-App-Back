const { getAnnouncementsForHomePage } = require("../../../models/announcements.model");
const { announcementData } = require("./announcements.serializer");
const { serializedData } = require('../../../services/serializeArray')

async function httpGetAllAnnouncements(req, res) {
    const announcements = await getAnnouncementsForHomePage();
    return res.status(200).json({
        data: serializedData(announcements, announcementData),
    })
}

module.exports = {
    httpGetAllAnnouncements,
}