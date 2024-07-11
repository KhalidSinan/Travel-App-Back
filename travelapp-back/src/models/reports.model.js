const Report = require('./reports.mongo')

async function getAllReportsOnApp() {
    return await Report.find({ on_organizer: false }).populate('user_id', 'name');
}

async function getAllReportsOnOrganizers() {
    return await Report.find({ on_organizer: true }).populate('user_id', 'name').populate('organizer_id', 'name');
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