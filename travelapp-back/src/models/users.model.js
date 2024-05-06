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

async function getWallet(user_id) {
    return await User.findById(user_id).select('wallet_account -_id')
}

async function putWallet(user_id, overall_price) {
    const user = await User.findById(user_id)
    user.wallet_account += overall_price
    await user.save();
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

module.exports = {
    postUser,
    getUser,
    putName,
    putGender,
    putDate,
    putProfilePic,
    getProfile,
    putPassword,
    putLocation,
    getWallet,
    putWallet,
    putEmailConfirmation,
    addDeviceToken,
    removeDeviceToken
}