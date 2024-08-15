function organizerDataDetails(organizer) {
    let data = organizer.trip_id.organizer_id
    return {
        id: data._id,
        name: data.user_id.name.first_name + ' ' + data.user_id.name.last_name,
        personal_picture: data.proofs.personal_picture
    }
}

module.exports = {
    organizerDataDetails
}