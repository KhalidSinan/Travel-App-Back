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

async function getAllDeviceTokens() {
    return await User.find({}, 'device_token').select('device_token -_id');
}

async function deleteAccount(user_id) {
    return await User.deleteOne({ _id: user_id });
}

async function acceptOrganizer(id) {
    return await User.findOneAndUpdate({ _id: id }, { is_organizer: true });
}

// No need
async function denyOrganizer(_id) {
    return await User.findOneAndUpdate({ _id }, { is_organizer: false });
}

async function getUserById(_id) {
    return await User.find({ _id })
}

async function deactivateAccount(_id) {
    return await User.findOneAndUpdate({ _id }, { is_organizer: false });
}

async function getUsersAge() {
    return await User.aggregate([
        {
            $project: {
                age: {
                    $floor: {
                        $divide: [
                            { $subtract: [new Date(), "$date_of_birth"] },
                            31557600000
                        ]
                    }
                },
                _id: 0
            }
        },
        {
            $group: {
                _id: {
                    $switch: {
                        branches: [
                            { case: { $lt: ['$age', 18] }, then: 'Under 18' },
                            { case: { $and: [{ $gte: ['$age', 18] }, { $lt: ['$age', 25] }] }, then: '18-24' },
                            { case: { $and: [{ $gte: ['$age', 25] }, { $lt: ['$age', 35] }] }, then: '25-34' },
                            { case: { $gte: ['$age', 35] }, then: '35 and above' }
                        ],
                        default: 'Unknown'
                    }
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                ageGroup: '$_id',
                count: 1
            }
        }
    ]);
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
    acceptOrganizer,
    getUserById,
    deactivateAccount,
    getUsersAge,
    getAllDeviceTokens
}