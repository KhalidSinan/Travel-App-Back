const OrganizerRequest = require('./organizer-request.mongo')

async function addRequest(data) {
    return await OrganizerRequest.create(data);
}

async function getRequests() {
    return await OrganizerRequest.find();
}

async function getRequest(id) {
    return await OrganizerRequest.findById(id);
}

async function acceptRequest(id) {
    return await OrganizerRequest.findByIdAndUpdate(id, { is_accepted: true });
}

async function denyRequest(id) {
    return await OrganizerRequest.findByIdAndUpdate(id, { is_accepted: false });
}

async function getRequestByUserId(user_id) {
    return await OrganizerRequest.findOne({ user_id });
}

module.exports = {
    addRequest,
    getRequests,
    getRequest,
    acceptRequest,
    denyRequest,
    getRequestByUserId
}