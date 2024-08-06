const { postReport } = require('../../../models/reports.model')
const { validatePostReport } = require('./reports.validation')
const { validationErrors } = require('../../../middlewares/validationErrors');
const { getUserById } = require('../../../models/users.model');
const { getOrganizedTripReservationsForUser } = require('../../../models/organized-trip-reservations.model');
const { organizerDataDetails } = require('./reports.serializer');
const { serializedData } = require('../../../services/serializeArray')

async function httpPostReport(req, res) {
    const { error } = validatePostReport(req.body);
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    if (req.body.on_organizer) {
        const organizer = await getUserById(req.body.organizer_id)
        if (organizer.length == 0 || !organizer[0].is_organizer)
            return res.status(200).json({ message: 'Organizer Not Found' })
    }
    const data = { user_id: req.user.id };
    Object.assign(data, req.body)

    await postReport(data);
    return res.status(200).json({ message: 'Report Successfully Sent' })
}

async function httpGetOrganizers(req, res) {
    const data = await getOrganizedTripReservationsForUser(req.user._id)
    return res.status(200).json({
        message: 'Organizers Retrieved Successfully',
        data: serializedData(data, organizerDataDetails)
    })
}

module.exports = {
    httpPostReport,
    httpGetOrganizers
}