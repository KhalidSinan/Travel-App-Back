const { getOrganizers, getOrganizer, getUserById, acceptOrganizer, deleteAccount } = require("../../../models/users.model")
const { validationErrors } = require('../../../middlewares/validationErrors')

async function httpGetAllOrganizers(req, res) {
    const organizers = await getOrganizers();
    return res.status(200).json({ organizers })
}

async function httpGetOneOrganizer(req, res) {
    const organizer = await getOrganizer(req.params.id);
    if (!organizer) return res.status(200).json({ message: 'Organizer Not Found' })
    return res.status(200).json({ organizer })
}

async function httpAcceptOrganizer(req, res) {
    const { error } = validateAcceptOrganizer(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) });

    const user = await getUserById(req.body.id);
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    await acceptOrganizer(req.body.id)
    return res.status(200).json({ message: 'Organizer Request Accepted' })
}

async function httpDenyOrganizer(req, res) {
    const { error } = validateAcceptOrganizer(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) });

    const user = await getUserById(req.body.id);
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    // await denyOrganizer(req.body.id)
    // Delete from organizers requests

    return res.status(200).json({ message: 'Organizer Request Denied' })
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
    httpAcceptOrganizer,
    httpDenyOrganizer,
    httpDeleteOrganizer,
    httpDeactivateOrganizer
}