function userData(user) {
    return {
        name: user.name,
        email: user.email,
        gender: user.gender ?? null,
        is_organizer: user.is_organizer,
        location: user.location ?? null,
        phone_number: user.phone ?? null,
        date_of_birth: user.date_of_birth ?? null,
        profile_pic: user.profile_pic ?? null
    }
}

module.exports = {
    userData
}