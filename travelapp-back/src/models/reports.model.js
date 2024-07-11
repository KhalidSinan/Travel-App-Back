const Report = require('./reports.mongo')

async function getAllReportsOnApp(skip, limit) {
    return await Report.find({ on_organizer: false })
        .populate('user_id', 'name')
        .skip(skip)
        .limit(limit);
}

async function getAllReportsOnOrganizers(skip, limit) {
    return await Report.find({ on_organizer: true })
        .populate('user_id', 'name').populate('organizer_id', 'name')
        .skip(skip)
        .limit(limit)
}

async function getOneReport(id) {
    return await Report.findById(id);
}

async function postReport(data) {
    return await Report.create(data)
}

async function deleteReport(_id) {
    return await Report.deleteOne({ _id })
}


module.exports = {
    getAllReportsOnApp,
    getAllReportsOnOrganizers,
    getOneReport,
    postReport,
    deleteReport
}