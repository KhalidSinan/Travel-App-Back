function organizersData(organizer) {
    const name = organizer.user_id.name.first_name + ' ' + organizer.user_id.name.last_name
    return {
        id: organizer._id,
        organizer_name: name,
        company_name: organizer.company_name,
        rating: organizer.rating,
        profile_pic: organizer.user_id.profile_pic
    }
}

function organizerData(organizer) {
    const name = organizer.user_id.name.first_name + ' ' + organizer.user_id.name.last_name;
    const phone = '+' + organizer.user_id.phone.country_code + ' ' + organizer.user_id.phone.number;
    const age = (Date.now() - organizer.user_id.date_of_birth) / 1000 / 60 / 60 / 24 / 365
    return {
        organizer_name: name,
        company_name: organizer.company_name,
        rating: organizer.rating,
        profile_pic: organizer.user_id.profile_pic,
        gender: organizer.user_id.gender,
        phone: phone,
        location: organizer.user_id.location,
        age: age.toFixed(0),
        num_of_trips: organizer.num_of_trips,
        years_of_experience: organizer.years_of_experience,
        // trips: 
    }
}

// الرحلات يلي عملها

module.exports = {
    organizersData,
    organizerData,
}