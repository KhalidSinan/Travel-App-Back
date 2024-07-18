function adminsData(admin) {
    return {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        created_at: admin.createdAt
    }
}

module.exports = {
    adminsData
}