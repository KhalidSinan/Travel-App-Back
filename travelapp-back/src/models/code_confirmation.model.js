const CodeConfirmation = require('./code-confirmation.mongo')

async function postRequest(data) {
    return await CodeConfirmation.create(data)
}

async function deleteRequests(user_id) {
    return await CodeConfirmation.deleteMany({ user_id })
}

async function getToken(user_id) {
    return await CodeConfirmation.findOne({ user_id }).select('token -_id')
}

module.exports = {
    postRequest,
    deleteRequests,
    getToken
}