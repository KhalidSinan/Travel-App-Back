const Report = require('./reports.mongo')

async function getAllReports() {
    return await Report.find().populate('user_id', 'name');
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
    getAllReports,
    getOneReport,
    postReport,
    deleteReport
}