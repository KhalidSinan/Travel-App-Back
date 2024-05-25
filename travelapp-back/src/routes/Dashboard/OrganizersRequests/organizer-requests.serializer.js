function organizerRequestsData(request) {
    return {
        id: request._id,
        user_id: request.user_id,
        name: request.name,
        years_of_experience: request.years_of_experience,
        sent_at: request.createdAt
    }
}

module.exports = {
    organizerRequestsData
}