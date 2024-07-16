const { getAllReportsOnApp, deleteReport, getOneReport, getAllReportsOnOrganizers } = require('../../../models/reports.model');
const { serializedData } = require('../../../services/serializeArray');
const { reportDataOnApp, reportDataOnOrganizer } = require('./reports.serializer');
const { getPagination } = require('../../../services/query')

async function httpGetAllReportsOnApp(req, res) {
    const { skip, limit } = getPagination(req.query)
    const reports = await getAllReportsOnApp(skip, limit);
    if (reports.length == 0) return res.status(200).json({ data: [] })
    return res.status(200).json({
        data: serializedData(reports, reportDataOnApp),
    })
}

async function httpGetAllReportsOnOrganizers(req, res) {
    const { skip, limit } = getPagination(req.query)
    const reports = await getAllReportsOnOrganizers(skip, limit);
    if (reports.length == 0) return res.status(200).json({ data: [] })
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


module.exports = {
    httpGetAllReportsOnApp,
    httpGetAllReportsOnOrganizers,
    httpDeleteReport
}