const { getAllReportsOnApp, deleteReport, getOneReport, getAllReportsOnOrganizers } = require('../../../models/reports.model');
const { serializedData } = require('../../../services/serializeArray');
const { reportDataOnApp, reportDataOnOrganizer } = require('./reports.serializer');

async function httpGetAllReportsOnApp(req, res) {
    const reports = await getAllReportsOnApp();
    return res.status(200).json({
        data: serializedData(reports, reportDataOnApp),
        count: reports.length
    })
}

async function httpGetAllReportsOnOrganizers(req, res) {
    const reports = await getAllReportsOnOrganizers();
    return res.status(200).json({
        data: serializedData(reports, reportDataOnOrganizer),
        count: reports.length
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