function organizersData(organizer) {
    //     id
    // organizer name
    // company name
    // rating
    // picture
    return {
        id: organizer._id,
        organizer_name: organizer.name,
        company_name: o,
        rating: organizer.rating,
        profile_pic: organizer.image
    }
}

function organizerData(organizer) {
    return {
        id: organizer._id,
        name: organizer.name,
        company_name: o,
        rating: organizer.rating,
        profile_pic: organizer.image
    }
}

module.exports = {
    organizersData,
    organizerData,
}