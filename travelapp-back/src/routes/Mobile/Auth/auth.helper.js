const { getToken } = require("../../../models/code_confirmation.model")

async function confirmTokenHelper(user, token) {
    const tokenSaved = await getToken(user.id)
    return token == tokenSaved.token
}

module.exports = { confirmTokenHelper }