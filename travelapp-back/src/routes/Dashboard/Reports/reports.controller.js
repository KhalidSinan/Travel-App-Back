const { getAllReportsOnApp, deleteReport, getOneReport, getAllReportsOnOrganizers } = require('../../../models/reports.model');
const { serializedData } = require('../../../services/serializeArray');
const { reportDataOnApp, reportDataOnOrganizer } = require('./reports.serializer');
const { getPagination } = require('../../../services/query');
const { filterReportsHelper } = require('./reports.helper');
const { getUserById } = require('../../../models/users.model');
const sendMail = require('../../../services/sendMail');

async function httpGetAllReportsOnApp(req, res) {
    const { skip, limit } = getPagination(req.query)
    const filter = filterReportsHelper(req.query)
    const reports = await getAllReportsOnApp(skip, limit, filter);
    return res.status(200).json({
        data: serializedData(reports, reportDataOnApp),
    })
}

async function httpGetAllReportsOnOrganizers(req, res) {
    const { skip, limit } = getPagination(req.query)
    const filter = filterReportsHelper(req.query)
    const reports = await getAllReportsOnOrganizers(skip, limit, filter);
    return res.status(200).json({
        data: serializedData(reports, reportDataOnOrganizer),
    })
}

async function httpDeleteReport(req, res) {
    const report = await getOneReport(req.params.id);
    if (!report) return res.status(400).json({ message: 'Report Not Found' })
    await deleteReport(req.params.id)
    return res.status(200).json({ message: 'Report Deleted' })
}

async function httpReplyReport(req, res) {
    const report = await getOneReport(req.params.id);
    if (!report) return res.status(400).json({ message: 'Report Not Found' })
    const user = await getUserById(report.user_id)
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    // await sendMail('Report Considered', user.email, { name, token, template_name: 'views/confirm_email.html' });


    return res.status(200).json({ message: 'Replied To User' })
}

module.exports = {
    httpGetAllReportsOnApp,
    httpGetAllReportsOnOrganizers,
    httpDeleteReport,
    httpReplyReport
}