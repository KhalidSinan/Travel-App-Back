function organizersData(organizer) {
    return {
        id: organizer._id,
        user_id: organizer.user_id,
        name: organizer.name,
        years_of_experience: organizer.years_of_experience,
        sent_at: organizer.updatedAt
    }
}

module.exports = {
    organizerRequestsData
}