const { getAllReports, deleteReport, getOneReport } = require('../../../models/reports.model');
const { serializedData } = require('../../../services/serializeArray');
const { reportData } = require('./reports.serializer');

async function httpGetAllReports(req, res) {
    const reports = await getAllReports();
    return res.status(200).json({
        data: serializedData(reports, reportData),
    })
}

async function httpDeleteReport(req, res) {
    const report = await getOneReport(req.params.id);
    if (!report) return res.status(400).json({ message: 'Report Not Found' })
    await deleteReport(req.params.id)
    return res.status(200).json({ message: 'Report Deleted' })
}


module.exports = {
    httpGetAllReports,
    httpDeleteReport
}