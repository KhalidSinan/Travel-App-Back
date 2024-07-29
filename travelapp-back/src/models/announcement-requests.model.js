const AnnouncementRequest = require('./announcement-requests.mongo')

async function getAnnouncementRequest(id) {
    return await AnnouncementRequest.findById(id);
}

async function getAnnouncementRequests(skip, limit, sort, filter) {
    const query = { is_accepted: { $ne: true } };
    if (Object.keys(filter).length > 0) Object.assign(query, filter);
    let requests = AnnouncementRequest.find(query)
        .populate({ path: 'organizer_id', populate: { path: 'user_id', select: 'name' } })
        .skip(skip)
        .limit(limit);
    if (sort && (sort == 'asc' || sort == 'desc')) requests = await requests.sort({ createdAt: sort })
    return requests
}

async function getAnnouncementRequestsCount(filter) {
    const query = { is_accepted: { $ne: true } };
    if (Object.keys(filter).length > 0) Object.assign(query, filter);
    return await AnnouncementRequest.find(query).countDocuments()
}

async function postAnnouncementRequest(data) {
    return await AnnouncementRequest.create(data)
}

async function acceptAnnouncementRequest(id) {
    return await AnnouncementRequest.findByIdAndUpdate(id, { is_accepted: true })
}

async function denyAnnouncementRequest(id) {
    return await AnnouncementRequest.findByIdAndUpdate(id, { is_accepted: false })
}

module.exports = {
    getAnnouncementRequest,
    getAnnouncementRequests,
    postAnnouncementRequest,
    acceptAnnouncementRequest,
    denyAnnouncementRequest,
    getAnnouncementRequestsCount
}