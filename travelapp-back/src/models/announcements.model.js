const Announcement = require('./announcements.mongo')

async function postAnnouncement(data) {
    return await Announcement.create({ announcement_title: data.title, announcement_body: data.body, expiry_date: data.expiry_date })
}

async function getAnnouncementsApp(skip, limit, sort, filter) {
    const query = { from_organizer: false };
    if (Object.keys(filter).length > 0) Object.assign(query, filter);
    let announcements = Announcement.find(query).skip(skip).limit(limit).populate({ path: 'organizer_id', populate: { path: 'user_id', select: 'name' } }).select('-_id').sort({ 'created_at': -1 });
    if (sort && (sort == 'asc' || sort == 'desc')) announcements = await announcements.sort({ createdAt: sort })
    return announcements
}

async function getAnnouncementsOrganizer(skip, limit, sort, filter) {
    const query = { from_organizer: true };
    if (Object.keys(filter).length > 0) Object.assign(query, filter);
    let announcements = Announcement.find(query).skip(skip).limit(limit).populate({ path: 'organizer_id', populate: { path: 'user_id', select: 'name' } }).select('-_id').sort({ 'created_at': -1 });
    if (sort && (sort == 'asc' || sort == 'desc')) announcements = await announcements.sort({ createdAt: sort })
    return announcements
}

async function getAnnouncementsForHomePage() {
    return await Announcement.find({ expiry_date: { $gt: Date.now() } });
}

async function getAnnouncementsCountApp(filter) {
    const query = { from_organizer: false };
    if (Object.keys(filter).length > 0) Object.assign(query, filter);
    return await Announcement.find(query).countDocuments();
}

async function getAnnouncementsCountOrganizer(filter) {
    const query = { from_organizer: true };
    if (Object.keys(filter).length > 0) Object.assign(query, filter);
    return await Announcement.find(query).countDocuments();
}

async function postAnnouncementForOrganizer(data) {
    return await Announcement.create(data)
}

module.exports = {
    postAnnouncement,
    getAnnouncementsApp,
    getAnnouncementsOrganizer,
    postAnnouncementForOrganizer,
    getAnnouncementsCountApp,
    getAnnouncementsCountOrganizer,
    getAnnouncementsForHomePage
}