const { userData } = require('./users.serializer');
const { validationErrors } = require('../../../middlewares/validationErrors')
const { putName, putGender, putDate, putProfilePic, getProfile, putLocation, putPassword, deleteAccount, putPhoneNumber } = require('../../../models/users.model');
const { validateChangeName, validateChangeGender, validateChangeDate, validateChangeLocation, validateChangePassword, validateDeleteAccount, validateBecomeOrganizer, validateChangePhoneNumber } = require('./users.validation');
const { addRequest, getRequest, getRequestByUserId } = require('../../../models/organizer-request.model');

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

async function httpPutPhoneNumber(req, res) {
    const { error } = await validateChangePhoneNumber(req.body)
    if (error) {
        return res.status(400).json({ message: validationErrors(error.details) })
    }
    const user = req.user;
    if (!user) return res.status(400).json({ message: 'User Not Found' })
    const data = {
        country_code: req.body.country_code,
        number: req.body.number,
    }
    await putPhoneNumber(user, data)
    return res.status(200).json({ message: 'Phone Number Updated Successfully' });
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

async function httpDeleteAccount(req, res) {
    const { error } = await validateDeleteAccount(req.body);
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const user = req.user;
    if (!user) return res.status(400).json({ message: 'User Not Found' })

    const check = await user.checkCredentials(user.password, req.body.password)
    if (!check) return res.status(200).json({ message: 'Incorrect Password' })

    await deleteAccount(user._id);
    return res.status(200).json({ message: 'Account Has Been Deleted' })
}

async function httpBecomeOrganizer(req, res) {
    const { error } = await validateBecomeOrganizer(req.body);
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    const user = req.user;
    if (!user) return res.status(400).json({ message: 'User Not Found' })
    const proofs = {
        personal_id: req.files.personal_id[0].filename,
        work_id: req.files.work_id[0].filename,
        personal_picture: req.files.personal_picture[0].filename,
        last_certificate: req.files.last_certificate[0].filename,
        companies_worked_for: req.body.companies_worked_for
    }
    const request = await getRequestByUserId(user._id)
    if (!request || request.is_accepted == false) {
        data = { company_name: req.body.company_name, years_of_experience: req.body.years_of_experience, user_id: user._id, proofs: proofs }
        await addRequest(data)
        return res.status(200).json({ message: 'Request To Become Organizer Has Been Sent' })
    } else if (request.is_accepted == true) {
        return res.status(200).json({ message: 'Already An Organizer' })
    } else {
        return res.status(200).json({ message: 'Already Sent A Request' })
    }
}


module.exports = {
    httpPutName,
    httpPutGender,
    httpPutDate,
    httpPutProfilePic,
    httpPutPhoneNumber,
    httpGetProfile,
    httpPutLocation,
    httpPutPassword,
    httpDeleteAccount,
    httpBecomeOrganizer
}