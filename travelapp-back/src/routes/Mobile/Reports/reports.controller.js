const { postReport } = require('../../../models/reports.model')
const { validatePostReport } = require('./reports.validation')
const { validationErrors } = require('../../../middlewares/validationErrors');
const { getUserById } = require('../../../models/users.model');
const { getOrganizedTripReservationsForUser } = require('../../../models/organized-trip-reservations.model');
const { organizerDataDetails } = require('./reports.serializer');
const { serializedData } = require('../../../services/serializeArray');
const { getOrganizer } = require('../../../models/organizers.model');

async function httpPostReportOnApp(req, res) {
    const { error } = validatePostReport(req.body);
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const data = { user_id: req.user.id, on_organizer: false };
    Object.assign(data, req.body)

    await postReport(data);
    return res.status(200).json({ message: 'Report On App Successfully Sent' })
}

async function httpPostReportOnOrganizer(req, res) {
    const { error } = validatePostReport(req.body);
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const organizer = await getOrganizer(req.params.id)
    if (!organizer) return res.status(400).json({ message: 'Organizer Not Found' })

    const data = { user_id: req.user.id, on_organizer: true, organizer_id: req.params.id };
    Object.assign(data, req.body)

    await postReport(data);
    return res.status(200).json({ message: 'Report On Organizer Successfully Sent' })
}

async function httpGetOrganizers(req, res) {
    const data = await getOrganizedTripReservationsForUser(req.user._id)

    return res.status(200).json({
        message: 'Organizers Retrieved Successfully',
        data: serializedData(data, organizerDataDetails)
    })
}

module.exports = {
    httpPostReportOnApp,
    httpPostReportOnOrganizer,
    httpGetOrganizers
}