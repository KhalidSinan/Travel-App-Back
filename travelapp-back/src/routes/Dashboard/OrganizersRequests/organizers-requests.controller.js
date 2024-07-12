const { getUserById, acceptOrganizer } = require("../../../models/users.model")
const { validationErrors } = require('../../../middlewares/validationErrors');
const { acceptRequest, denyRequest, getRequests, getRequest } = require("../../../models/organizer-request.model");
const { serializedData } = require('../../../services/serializeArray')
const { organizerRequestsData } = require('./organizer-requests.serializer')
const { getPagination } = require('../../../services/query');
const { postOrganizerData } = require("../../../models/organizers.model");

// Done
async function httpGetOrganizersRequests(req, res) {
    const { skip, limit } = getPagination(req.query)
    const requests = await getRequests(skip, limit)
    return res.status(200).json({ data: serializedData(requests, organizerRequestsData) })
}

// Done
async function httpGetOrganizerRequest(req, res) {
    const user = await getUserById(req.body.id);
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    const requests = await getRequest(req.params.id)

    return res.status(200).json({ data: organizerRequestsData(requests) })
}

// Done
async function httpAcceptOrganizerRequest(req, res) {
    const request = await getRequest(req.params.id)
    if (!request) return res.status(200).json({ message: 'Organizer Request Not Found' })

    if (request.is_accepted) return res.status(200).json({ message: 'Organizer Request Already Accepted' })

    // Need id of request
    await acceptRequest(req.params.id)
    await acceptOrganizer(request.user_id)
    const data = {
        user_id: request.user_id,
        company_name: request.company_name,
        years_of_experience: request.years_of_experience
        // pdfs
    }
    await postOrganizerData(data)

    return res.status(200).json({ message: 'Organizer Request Accepted' })
}

// Done
async function httpDenyOrganizerRequest(req, res) {
    // Need id of request
    const request = await getRequest(req.params.id)
    if (!request) return res.status(200).json({ message: 'Organizer Request Not Found' })

    await denyRequest(req.params.id)

    return res.status(200).json({ message: 'Organizer Request Denied' })
}

module.exports = {
    httpGetOrganizersRequests,
    httpGetOrganizerRequest,
    httpAcceptOrganizerRequest,
    httpDenyOrganizerRequest,
}