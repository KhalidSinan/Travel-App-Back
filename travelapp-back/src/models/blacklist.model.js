const Blacklist = require('./blacklist.mongo')

async function postBlacklist(data) {
    return await Blacklist.create(data)
}

async function deleteBlacklist(user_id) {
    return await Blacklist.deleteMany({ user_id })
}

async function getBlacklist(user_id, token) {
    return await Blacklist.findOne({ user_id, token_blacklisted: token })
}

module.exports = {
    postBlacklist,
    deleteBlacklist,
    getBlacklist
}