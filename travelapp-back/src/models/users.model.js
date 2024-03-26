const User = require('./users.mongo');
const bcrypt = require('bcrypt');

async function postUser(data) {
    return await User.create(data);
}

async function getUser(email) {
    return await User.findOne({ email });
}

async function findAllUsers() {
    return await User.find({});
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

module.exports = {
    postUser,
    getUser,
    findAllUsers,
    putName,
    putGender,
    putDate,
    putProfilePic,
    getProfile
}