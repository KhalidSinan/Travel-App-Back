const AnnouncementRequest = require('./announcement-requests.mongo')

async function getAnnouncementRequest(id) {
    return await AnnouncementRequest.findById(id);
}

async function getAnnouncementRequests(skip, limit) {
    return await AnnouncementRequest.find().skip(skip).limit(limit);
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
    denyAnnouncementRequest
}