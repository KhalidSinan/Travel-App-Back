const { deleteAccount, deactivateAccount, getDeviceTokens } = require("../../../models/users.model")
const { getPagination } = require('../../../services/query')
const { getOrganizer, getOrganizers, deleteOrganizerAccount, searchOrganizers } = require("../../../models/organizers.model");
const { organizersData, organizerData } = require("./organizers.serializer");
const { serializedData } = require('../../../services/serializeArray');
const { searchOrganizersHelper } = require("./organizers.helper");
const sendPushNotification = require("../../../services/notifications");
const { validationErrors } = require("../../../middlewares/validationErrors");
const { validateAlertOrganizer } = require('./organizers.validation')

async function httpGetAllOrganizers(req, res) {
    const { skip, limit } = getPagination(req.query)
    const organizers = await getOrganizers(skip, limit);
    return res.status(200).json({ data: serializedData(organizers, organizersData) })
}

async function httpGetOneOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    // get trips
    return res.status(200).json({ data: organizerData(organizer) })
}

async function httpSearchOrganizers(req, res) {
    const { skip, limit } = getPagination(req.query)
    let organizers = await getOrganizers(0, 0);
    organizers = searchOrganizersHelper(organizers, req.query.name)
    organizers = organizers.slice(skip, skip + limit)
    return res.status(200).json({ data: serializedData(organizers, organizersData) })
}

// Done
async function httpDeleteOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    await deleteAccount(organizer.user_id._id)
    await deleteOrganizerAccount(req.params.id)
    return res.status(200).json({ message: 'Organizer Account Deleted' });
}

// Done
async function httpDeactivateOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    await deactivateAccount(organizer.user_id._id)
    await deleteOrganizerAccount(req.params.id)
    return res.status(200).json({ message: 'Organizer Account Deactivated' });
}

async function httpAlertOrganizer(req, res) {
    const { error } = validateAlertOrganizer(req.body);
    if (error) return res.status(400).json({ message: validationErrors(error.details) });

    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })

    const tokens = await getDeviceTokens(organizer.user_id)
    await sendPushNotification(req.body.title, req.body.body, tokens[0].device_token)

    return res.status(200).json({ message: 'Organizer Has Been Alerted' });
}

module.exports = {
    httpGetAllOrganizers,
    httpGetOneOrganizer,
    httpDeleteOrganizer,
    httpSearchOrganizers,
    httpDeactivateOrganizer,
    httpAlertOrganizer
}