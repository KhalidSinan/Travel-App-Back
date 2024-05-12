const { userData } = require('./users.serializer');
const { validationErrors } = require('../../middlewares/validationErrors')
const { putName, putGender, putDate, putProfilePic, getProfile, putLocation, putPassword } = require('../../models/users.model');
const { validateChangeName, validateChangeGender, validateChangeDate, validateChangeLocation, validateChangePassword } = require('./users.validation')

async function httpGetProfile(req, res) {
    const user = req.user;
    if (!user) return res.status(400).json({ message: 'User Not Found' })
    const profile = await getProfile(user);
    return res.status(200).json({
        message: 'Profile Retreived',
        profile: userData(profile)
    })
}

async function httpPutName(req, res) {
    const { error } = await validateChangeName(req.body)
    if (error) {
        return res.status(400).json({ message: validationErrors(error.details) })
    }
    const user = req.user;
    if (!user) return res.status(400).json({ message: 'User Not Found' })
    const name = { first_name: req.body.first_name, last_name: req.body.last_name }
    await putName(user, name);
    return res.status(200).json({
        message: 'Name Changed',
        name: user.name
    })
}

async function httpPutGender(req, res) {
    const { error } = await validateChangeGender(req.body)
    if (error) {
        return res.status(400).json({ message: validationErrors(error.details) })
    }
    const user = req.user;
    if (!user) return res.status(400).json({ message: 'User Not Found' })
    const gender = await putGender(user, req.body.gender);
    return res.status(200).json({
        message: 'Gender Changed',
        gender
    })
}

async function httpPutDate(req, res) {
    const { error } = await validateChangeDate(req.body)
    if (error) {
        return res.status(400).json({ message: validationErrors(error.details) })
    }
    const user = req.user;
    if (!user) return res.status(400).json({ message: 'User Not Found' })
    const { date_of_birth } = await putDate(user, req.body.date);
    return res.status(200).json({
        message: 'Date Changed',
        date_of_birth
    })
}

async function httpPutLocation(req, res) {
    const { error } = await validateChangeLocation(req.body)
    if (error) {
        return res.status(400).json({ message: validationErrors(error.details) })
    }
    const user = req.user;
    if (!user) return res.status(400).json({ message: 'User Not Found' })
    const { location } = await putLocation(user, { city: req.body.city, country: req.body.country });
    return res.status(200).json({
        message: 'Location Changed',
        location
    })
}

async function httpPutProfilePic(req, res) {
    const user = req.user;
    if (!user) return res.status(400).json({ message: 'User Not Found' })
    if (!req.file) {
        return res.status(404).json({ message: 'Image Not Found' });
    }
    await putProfilePic(user, req.file.filename)
    return res.status(200).json({ message: 'Profile Picture Updated Successfully' });
}

async function httpPutPassword(req, res) {
    const { error } = await validateChangePassword(req.body);
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const user = req.user
    if (!user) return res.status(400).json({ message: 'User Not Found' })
    const check = await user.checkCredentials(user.password, req.body.old_password);
    if (!check) return res.status(400).json({ message: 'Old Password Does Not Match' })
    await putPassword(user, req.body.new_password)
    return res.status(200).json({ message: 'Password Updated Successfully' })
}


module.exports = {
    httpPutName,
    httpPutGender,
    httpPutDate,
    httpPutProfilePic,
    httpGetProfile,
    httpPutLocation,
    httpPutPassword
}