const Organizers = require('./organizers.mongo')

async function getOrganizers(skip, limit) {
    return await Organizers.find().skip(skip).limit(limit).populate('user_id', 'name profile_pic');
}

async function getOrganizersCount(skip, limit) {
    return await Organizers.find().countDocuments()
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

async function incrementWarnings(organizer) {
    organizer.num_of_warnings++;
    return await organizer.save();
}


module.exports = {
    getOrganizers,
    getOrganizer,
    deleteOrganizerAccount,
    postOrganizerData,
    incrementWarnings,
    getOrganizersCount
}