function filterReportsHelper(data) {
    const { start_date, end_date } = data
    const filter = {};
    if (start_date && end_date) {
        filter.createdAt = {
            $gte: new Date(start_date).toDateString(),
            $lte: new Date(end_date).toDateString()
        }
    }
    return filter
}

module.exports = {
    filterReportsHelper
}