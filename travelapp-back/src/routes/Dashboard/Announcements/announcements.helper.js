const { convertDateStringToDate } = require("../../../services/convertTime");

function filterAnnouncementsHelper(data) {
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

module.exports = {
    filterAnnouncementsHelper
}