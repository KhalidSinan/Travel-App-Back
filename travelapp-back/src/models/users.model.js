const User = require('./users.mongo');
const bcrypt = require('bcrypt');

async function postUser(data) {
    return await User.create(data);
}

async function getUser(email) {
    return await User.findOne({ email });
}

async function putName(user, name) {
    user.name.first_name = name.first_name;
    user.name.last_name = name.last_name;
    return await user.save();
}

async function putGender(user, gender) {
    user.gender = gender;
    return await user.save();
}

async function putDate(user, date) {
    user.date_of_birth = date;
    return await user.save();
}

async function putProfilePic(user, profile_pic) {
    user.profile_pic = profile_pic;
    return await user.save();
}

async function putPhoneNumber(user, phone_number) {
    user.phone = phone_number;
    return await user.save();
}

async function getProfile(user) {
    return user
}

async function putPassword(user, password) {
    user.password = password;
    return await user.save();
}

async function putLocation(user, location) {
    user.location = location;
    return await user.save();
}


function checkConfirmed(user) {
    return user.email_confirmed == true;
}

async function putEmailConfirmation(user) {
    user.email_confirmed = true;
    await user.save();
}

async function addDeviceToken(user, token) {
    user.device_token = user.device_token.filter((obj) => obj.token != token.token);
    user.device_token.push(token);
    await user.save();
}

async function removeDeviceToken(user, token) {
    user.device_token = user.device_token.filter((obj) => obj.token != token.token);
    await user.save();
}

async function getDeviceTokens(user_id) {
    return await User.find({ _id: user_id }).select('device_token -_id');
}

async function deleteAccount(user_id) {
    return await User.deleteOne({ _id: user_id });
}

async function getOrganizers() {
    return await User.find({ is_organizer: true });
}

async function getOrganizer(_id) {
    return await User.find({ _id, is_organizer: true });
}

async function acceptOrganizer(id) {
    return await User.findOneAndUpdate({ _id: id }, { is_organizer: true });
}

// No need
async function denyOrganizer(_id) {
    return await User.findOneAndUpdate({ _id }, { is_organizer: true });
}

async function getUserById(_id) {
    return await User.find({ _id })
}

async function deactivateAccount(_id) {
    return await User.findOneAndUpdate({ _id }, { is_organizer: false });
}

module.exports = {
    postUser,
    getUser,
    putName,
    putGender,
    putDate,
    putProfilePic,
    putPhoneNumber,
    getProfile,
    putPassword,
    putLocation,
    putEmailConfirmation,
    addDeviceToken,
    removeDeviceToken,
    checkConfirmed,
    getDeviceTokens,
    deleteAccount,
    getOrganizers,
    getOrganizer,
    acceptOrganizer,
    getUserById,
    deactivateAccount
}