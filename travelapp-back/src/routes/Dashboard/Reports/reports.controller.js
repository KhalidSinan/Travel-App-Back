const { getAllReportsOnApp, deleteReport, getOneReport, getAllReportsOnOrganizers, getAllReportsOnAppCount, getAllReportsOnOrganizersCount, putRepliedTo } = require('../../../models/reports.model');
const { serializedData } = require('../../../services/serializeArray');
const { reportDataOnApp, reportDataOnOrganizer } = require('./reports.serializer');
const { getPagination } = require('../../../services/query');
const { filterReportsHelper, searchOrganizerNameHelper } = require('./reports.helper');
const { getUserById } = require('../../../models/users.model');
const sendMail = require('../../../services/sendMail');

async function httpGetAllReportsOnApp(req, res) {
    req.query.limit = 6
    const { skip, limit } = getPagination(req.query)
    const filter = filterReportsHelper(req.query)
    const reports = await getAllReportsOnApp(skip, limit, filter)
    const count = await getAllReportsOnAppCount(filter)
    return res.status(200).json({
        data: serializedData(reports, reportDataOnApp),
        count: count
    })
}

async function httpGetAllReportsOnOrganizers(req, res) {
    req.query.limit = 6
    const { skip, limit } = getPagination(req.query)
    const filter = filterReportsHelper(req.query)
    let reports = await getAllReportsOnOrganizers(filter);
    reports = searchOrganizerNameHelper(reports, req.query.search)
    const count = reports.length
    reports = reports.slice(skip, skip + limit)
    return res.status(200).json({
        data: serializedData(reports, reportDataOnOrganizer),
        count: count
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
    let user = await getUserById(report.user_id)
    if (!user) return res.status(400).json({ message: 'User Not Found' })
    user = user[0]
    const name = user.name.first_name + ' ' + user.name.last_name
    const attachments = [{
        filename: 'logo.jpg',
        path: path.join(__dirname, '../../../', 'public', 'images', 'mails', 'logo.png'),
        cid: 'logo'
    }];
    await sendMail('Report Considered', user.email, { name, report_id: report._id, template_name: 'views/report_reply.html' }, attachments);
    await putRepliedTo(req.params.id)
    return res.status(200).json({ message: 'Replied To User' })
}

module.exports = {
    httpGetAllReportsOnApp,
    httpGetAllReportsOnOrganizers,
    httpDeleteReport,
    httpReplyReport
}