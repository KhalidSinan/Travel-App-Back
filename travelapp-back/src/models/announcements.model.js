const Announcement = require('./announcements.mongo')

async function postAnnouncement(data) {
    return await Announcement.create({ announcement_title: data.title, announcement_body: data.body })
}

async function getAnnouncements(skip, limit, sort, filter) {
    let announcements = Announcement.find(filter).skip(skip).limit(limit).populate({ path: 'organizer_id', populate: { path: 'user_id', select: 'name' } }).select('-_id').sort({ 'created_at': -1 });
    if (sort && (sort == 'asc' || sort == 'desc')) announcements = await announcements.sort({ createdAt: sort })
    return announcements
}

async function getAnnouncementsCount() {
    return await Announcement.find().countDocuments();
}

async function postAnnouncementForOrganizer(data) {
    return await Announcement.create({
        announcement_title: data.announcement_title,
        announcement_body: data.announcement_body,
        from_organizer: true,
        organized_trip_id: data.organized_trip_id,
        organizer_id: data.organizer_id
    })
}

module.exports = {
    postAnnouncement,
    getAnnouncements,
    postAnnouncementForOrganizer,
    getAnnouncementsCount
}