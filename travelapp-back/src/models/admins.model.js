// CRUD
const Admin = require('./admins.mongo')

async function findAdmin(username) {
    return await Admin.findOne({ username });
}

async function getAdmins(skip, limit) {
    return await Admin.find({ role: { $ne: 'Super-Admin' } })
        .skip(skip)
        .limit(limit)
        .select('-_id -__v')
}

async function postAdmin(data) {
    return await Admin.create(data)
}

async function deleteAdmin(id) {
    return await Admin.deleteOne({ _id: id })
}

module.exports = {
    findAdmin,
    getAdmins,
    postAdmin,
    deleteAdmin
}