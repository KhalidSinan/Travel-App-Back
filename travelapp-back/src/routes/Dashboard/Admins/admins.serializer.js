function adminsData(admin) {
    return {
        username: admin.username,
        role: admin.role,
        created_at: admin.createdAt
    }
}

module.exports = {
    adminsData
}