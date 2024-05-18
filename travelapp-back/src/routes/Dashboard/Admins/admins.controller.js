const { findAdmin, getAdmins, postAdmin, deleteAdmin } = require('../../../models/admins.model')
const { validateLoginAdmin, validatePostAdmin, validateDeleteAdmin } = require('./admins.validation')
const { generateToken } = require('../../../services/token')
const { getPagination } = require('../../../services/query')
const { validationErrors } = require('../../../middlewares/validationErrors')
const { postBlacklist } = require('../../../models/blacklist.model')

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
    const { skip, limit } = getPagination(req.query)
    const admins = await getAdmins(skip, limit)
    return res.status(200).json(admins)
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
    const superAdmin = req.user;
    const check = superAdmin.checkCredentials(superAdmin.password, req.body.password);
    if (check) {
        await deleteAdmin(req.params.id)
        return res.status(200).json({ message: 'Admin Deleted' })
    }
    return res.status(400).json({ message: 'Not Authorized' })
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
    httpPostAdmin,
    httpDeleteAdmin,
    logout
}