const Announcement = require('./announcements.mongo')

async function postAnnouncement(data) {
    return await Announcement.create({ announcement_title: data.title, announcement_body: data.body, expiry_date: data.expiry_date })
}

async function getAnnouncements(skip, limit, sort, filter) {
    let announcements = Announcement.find(filter).skip(skip).limit(limit).populate({ path: 'organizer_id', populate: { path: 'user_id', select: 'name' } }).select('-_id').sort({ 'created_at': -1 });
    if (sort && (sort == 'asc' || sort == 'desc')) announcements = await announcements.sort({ createdAt: sort })
    return announcements
}

async function getAnnouncementsForHomePage() {
    return await Announcement.find({ expiry_date: { $gt: Date.now() } });
}

async function getAnnouncementsCount(filter) {
    return await Announcement.find(filter).countDocuments();
}

async function postAnnouncementForOrganizer(data) {
    return await Announcement.create(data)
}

module.exports = {
    postAnnouncement,
    getAnnouncements,
    postAnnouncementForOrganizer,
    getAnnouncementsCount,
    getAnnouncementsForHomePage
}