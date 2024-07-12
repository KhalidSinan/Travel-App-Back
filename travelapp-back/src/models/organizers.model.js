const Organizers = require('./organizers.mongo')

async function getOrganizers(skip, limit) {
    return await Organizers.find().skip(skip).limit(limit).populate('user_id', 'name profile_pic');
}

async function getOrganizer(_id) {
    return await Organizers.findById(_id).populate('user_id', 'name profile_pic location phone date_of_birth gender');
}

async function deleteOrganizerAccount(_id) {
    return await Organizers.findByIdAndDelete(_id);
}

async function postOrganizerData(data) {
    return await Organizers.create(data);
}

module.exports = {
    getOrganizers,
    getOrganizer,
    deleteOrganizerAccount,
    postOrganizerData,
}