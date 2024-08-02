const { findAdmin, getAdmins, postAdmin, deleteAdmin, searchAdmins, getAdmin } = require('../../../models/admins.model')
const { validateLoginAdmin, validatePostAdmin, validateDeleteAdmin } = require('./admins.validation')
const { generateToken } = require('../../../services/token')
const { validationErrors } = require('../../../middlewares/validationErrors')
const { postBlacklist } = require('../../../models/blacklist.model')
const { serializedData } = require('../../../services/serializeArray')
const { adminsData } = require('./admins.serializer')

// Done
async function login(req, res) {
    const { error } = validateLoginAdmin(req.body)
    if (error) return res.status(400).json({ message: 'Not Authorized' });

    const admin = await findAdmin(req.body.username)
    if (admin) {
        const check = await admin.checkCredentials(admin.password, req.body.password)
        if (check) {
            return res.status(200).json({
                message: 'Logged In As ' + admin.role,
                token: generateToken({ id: admin._id, username: admin.username }),
            });
        }
    }
    return res.status(400).json({ message: 'Not Authorized' });
}

async function httpGetAllAdmins(req, res) {
    const admins = await getAdmins()
    return res.status(200).json({ data: serializedData(admins, adminsData) })
}

async function httpSearchAdmins(req, res) {
    const admins = await searchAdmins(req.query.username)
    return res.status(200).json({ data: serializedData(admins, adminsData) })
}

async function httpPostAdmin(req, res) {
    const { error } = validatePostAdmin(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) });
    const data = { username: req.body.username, password: req.body.password, role: req.body.role }
    await postAdmin(data);
    return res.status(200).json({ message: 'Admin Created', data: data });
}

async function httpDeleteAdmin(req, res) {
    const { error } = validateDeleteAdmin(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) });
    const admin = await getAdmin(req.params.id)
    if (!admin) return res.status(400).json({ message: 'Admin Not Found' })
    const superAdmin = req.user;
    const check = await superAdmin.checkCredentials(superAdmin.password, req.body.password);
    if (!check) return res.status(400).json({ message: 'Not Authorized' })
    await deleteAdmin(req.params.id)
    return res.status(200).json({ message: 'Admin Deleted' })
}

// Think
async function logout(req, res) {
    const user = req.user;
    const token = req.headers.authorization.split(' ')[1];
    const data = {
        user_id: user.id,
        token_blacklisted: token,
        user_type: 'Admin'
    }
    await postBlacklist(data)
    return res.status(200).json({ message: 'Logged Out Successfully' })
}


module.exports = {
    login,
    httpGetAllAdmins,
    httpSearchAdmins,
    httpPostAdmin,
    httpDeleteAdmin,
    logout
}