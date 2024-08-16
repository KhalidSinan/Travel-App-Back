const { getUserById, acceptOrganizer, getDeviceTokens } = require("../../../models/users.model")
const { validationErrors } = require('../../../middlewares/validationErrors');
const { acceptRequest, denyRequest, getRequests, getRequest, getRequestsCount } = require("../../../models/organizer-request.model");
const { serializedData } = require('../../../services/serializeArray')
const { organizerRequestsData, organizerRequestDetailsData } = require('./organizer-requests.serializer')
const { getPagination } = require('../../../services/query');
const { postOrganizerData } = require("../../../models/organizers.model");
const sendPushNotification = require('../../../services/notifications');
const { postNotification } = require("../../../models/notification.model");

// Done
async function httpGetOrganizersRequests(req, res) {
    req.query.limit = 6
    const { skip, limit } = getPagination(req.query)
    const requests = await getRequests(skip, limit)
    const requestsCount = await getRequestsCount()
    return res.status(200).json({ data: serializedData(requests, organizerRequestsData), count: requestsCount })
}

// Done
async function httpGetOrganizerRequest(req, res) {
    const user = await getUserById(req.body.id);
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    const request = await getRequest(req.params.id)

    return res.status(200).json({ data: organizerRequestDetailsData(request) })
}

// Done
async function httpAcceptOrganizerRequest(req, res) {
    const request = await getRequest(req.params.id)
    if (!request) return res.status(400).json({ message: 'Organizer Request Not Found' })

    if (request.is_accepted) return res.status(400).json({ message: 'Organizer Request Already Accepted' })

    await acceptRequest(req.params.id)
    await acceptOrganizer(request.user_id)
    const tokens = await getDeviceTokens(request.user_id)
    await sendPushNotification('Request Accepted', 'You are now an organizer', tokens, '/notification-screen')
    const data = {
        user_id: request.user_id,
        company_name: request.company_name,
        years_of_experience: request.years_of_experience,
        proofs: request.proofs
    }
    const notificationData = {
        user_id: request.user_id,
        notification_title: 'Request Accepted',
        notification_body: 'You are now an organizer',
        is_global: false
    }
    await postNotification(notificationData)
    await postOrganizerData(data)

    return res.status(200).json({ message: 'Organizer Request Accepted' })
}

// Done
async function httpDenyOrganizerRequest(req, res) {
    // Need id of request
    const request = await getRequest(req.params.id)
    if (!request) return res.status(400).json({ message: 'Organizer Request Not Found' })

    await denyRequest(req.params.id)

    return res.status(200).json({ message: 'Organizer Request Denied' })
}

module.exports = {
    httpGetOrganizersRequests,
    httpGetOrganizerRequest,
    httpAcceptOrganizerRequest,
    httpDenyOrganizerRequest,
}