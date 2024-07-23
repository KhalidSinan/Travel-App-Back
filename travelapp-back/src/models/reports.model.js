const Report = require('./reports.mongo')

async function getAllReportsOnApp(skip, limit, filter = {}) {
    let query = { on_organizer: false }
    if (filter.createdAt) query.createdAt = filter.createdAt
    return await Report.find(query)
        .populate('user_id', 'name')
        .skip(skip)
        .limit(limit);
}

async function getAllReportsOnAppCount(filter = {}) {
    let query = { on_organizer: false }
    if (filter.createdAt) query.createdAt = filter.createdAt
    return await Report.find(query).countDocuments()
}

async function getAllReportsOnOrganizers(skip, limit, filter = {}) {
    let query = { on_organizer: true }
    if (filter.createdAt) query.createdAt = filter.createdAt
    return await Report.find(query)
        .populate('user_id', 'name').populate('organizer_id', 'name')
        .skip(skip)
        .limit(limit)
}

async function getAllReportsOnOrganizersCount(filter = {}) {
    let query = { on_organizer: true }
    if (filter.createdAt) query.createdAt = filter.createdAt
    return await Report.find(query).countDocuments()
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
    deleteReport,
    getAllReportsOnAppCount,
    getAllReportsOnOrganizersCount

}