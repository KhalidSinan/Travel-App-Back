function announcementRequestData(announcement_request) {
    const firstName = announcement_request.organizer_id?.user_id?.name?.first_name || '';
    const lastName = announcement_request.organizer_id?.user_id?.name?.last_name || '';
    const name = firstName + ' ' + lastName;
    return {
        id: announcement_request._id,
        announcement_title: announcement_request.announcement_title,
        announcement_body: announcement_request.announcement_body,
        organizer_name: name.trim() ? name : null,
        organized_trip_id: announcement_request.organized_trip_id,
        created_at: announcement_request.createdAt
    }
}

module.exports = {
    announcementRequestData
}