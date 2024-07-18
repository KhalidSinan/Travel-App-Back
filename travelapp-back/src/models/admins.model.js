// CRUD
const Admin = require('./admins.mongo')

async function findAdmin(username) {
    return await Admin.findOne({ username });
}

async function getAdmin(id) {
    return await Admin.findById(id);
}

async function getAdmins() {
    return await Admin.find({ role: { $ne: 'Super-Admin' } })
        .select('-__v')
}

async function postAdmin(data) {
    return await Admin.create(data)
}

async function deleteAdmin(id) {
    return await Admin.deleteOne({ _id: id })
}

async function searchAdmins(username) {
    return await Admin.find({ username: { $regex: new RegExp(username, 'i') }, role: { $ne: 'Super-Admin' } })

}

module.exports = {
    findAdmin,
    getAdmins,
    postAdmin,
    deleteAdmin,
    searchAdmins,
    getAdmin
}