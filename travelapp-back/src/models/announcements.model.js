const Announcement = require('./announcements.mongo')

async function postAnnouncement(data) {
    return await Announcement.create({ announcement_title: data.title, announcement_body: data.body })
}

async function getAnnouncements() {
    return await Announcement.find().select('-_id').sort({ 'created_at': -1 });
}

module.exports = {
    postAnnouncement,
    getAnnouncements
}