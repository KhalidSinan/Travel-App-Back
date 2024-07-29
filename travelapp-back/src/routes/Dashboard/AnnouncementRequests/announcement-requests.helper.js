const { getToken } = require("../../../models/code_confirmation.model")
const { convertDateStringToDate } = require("../../../services/convertTime");

function filterAnnouncementRequestsHelper(data) {
    let { start_date, end_date } = data
    const filter = {};
    if (start_date && end_date) {
        start_date = convertDateStringToDate(start_date)
        end_date = convertDateStringToDate(end_date);
        filter.createdAt = {
            $gte: new Date(start_date),
            $lte: new Date(end_date)
        }
    }
    return filter
}

async function confirmTokenHelper(user, token) {
    const tokenSaved = await getToken(user.id)
    return token == tokenSaved.token
}

module.exports = { confirmTokenHelper, filterAnnouncementRequestsHelper }