const { getOrganizer, deleteAccount, getOrganizers, deactivateAccount } = require("../../../models/users.model")

async function httpGetAllOrganizers(req, res) {
    const organizers = await getOrganizers();
    return res.status(200).json({ data: organizers })
}

async function httpGetOneOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    return res.status(200).json({ data: organizer })
}

async function httpDeleteOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    await deleteAccount(req.params.id)
    return res.status(200).json({ message: 'Organizer Account Deleted' });
}

async function httpDeactivateOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    await deactivateAccount(req.params.id)
    return res.status(200).json({ message: 'Organizer Account Deactivated' });
}

module.exports = {
    httpGetAllOrganizers,
    httpGetOneOrganizer,
    httpDeleteOrganizer,
    httpDeactivateOrganizer
}