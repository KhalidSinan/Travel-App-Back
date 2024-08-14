function announcementAppData(announcement) {
    return {
        id: announcement._id,
        announcement_title: announcement.announcement_title,
        announcement_body: announcement.announcement_body,
        from_organizer: announcement.from_organizer,
        expiry_date: announcement.expiry_date,
        created_at: announcement.createdAt,
    }
}

function announcementOrganizerData(announcement) {
    const firstName = announcement.organizer_id?.user_id?.name?.first_name || '';
    const lastName = announcement.organizer_id?.user_id?.name?.last_name || '';
    const name = firstName + ' ' + lastName;
    return {
        id: announcement._id,
        announcement_title: announcement.announcement_title,
        announcement_body: announcement.announcement_body,
        from_organizer: announcement.from_organizer,
        organizer_name: name.trim() ? name : null,
        organizer_id: announcement.organizer_id?._id ?? null,
        organized_trip_id: announcement.organized_trip_id ?? null,
        location: announcement.location,
        price: announcement.price,
        expiry_date: announcement.expiry_date,
        created_at: announcement.createdAt,
    }
}


module.exports = {
    announcementAppData,
    announcementOrganizerData
}