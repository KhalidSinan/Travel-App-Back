const { deleteAccount, deactivateAccount } = require("../../../models/users.model")
const { getPagination } = require('../../../services/query')
const { getOrganizer, getOrganizers, deleteOrganizerAccount } = require("../../../models/organizers.model");
const { organizersData, organizerData } = require("./organizers.serializer");
const { serializedData } = require('../../../services/serializeArray')

async function httpGetAllOrganizers(req, res) {
    const { skip, limit } = getPagination(req.query)
    const organizers = await getOrganizers(skip, limit);
    return res.status(200).json({ data: serializedData(organizers, organizersData) })
}

async function httpGetOneOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    console.log(organizer)
    // get trips
    return res.status(200).json({ data: organizerData(organizer) })
}

/////// fix
async function httpDeleteOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    await deleteAccount(req.params.id)
    await deleteOrganizerAccount(req.params.id)
    return res.status(200).json({ message: 'Organizer Account Deleted' });
}

async function httpDeactivateOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    await deactivateAccount(req.params.id)
    await deleteOrganizerAccount(req.params.id)
    return res.status(200).json({ message: 'Organizer Account Deactivated' });
}

module.exports = {
    httpGetAllOrganizers,
    httpGetOneOrganizer,
    httpDeleteOrganizer,
    httpDeactivateOrganizer
}