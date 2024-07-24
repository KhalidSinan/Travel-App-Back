const Announcement = require('./announcements.mongo')

async function postAnnouncement(data) {
    return await Announcement.create({ announcement_title: data.title, announcement_body: data.body })
}

async function getAnnouncements() {
    return await Announcement.find().select('-_id').sort({ 'created_at': -1 });
}

async function postAnnouncementForOrganizer(data) {
    return await Announcement.create({
        announcement_title: data.announcement_title,
        announcement_body: data.announcement_body,
        from_organizer: true,
        organized_trip_id: data.organized_trip_id
    })
}

module.exports = {
    postAnnouncement,
    getAnnouncements,
    postAnnouncementForOrganizer
}