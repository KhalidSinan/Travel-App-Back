const { postReport } = require('../../../models/reports.model')
const { validatePostReport } = require('./reports.validation')
const { validationErrors } = require('../../../middlewares/validationErrors')

async function httpPostReport(req, res) {
    const { error } = validatePostReport(req.body);
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const data = { user_id: req.user.id };
    Object.assign(data, req.body)

    await postReport(data);
    return res.status(200).json({ message: 'Report Successfully Sent' })
}

module.exports = {
    httpPostReport,
}