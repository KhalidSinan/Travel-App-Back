const { convertDateStringToDate } = require("../../../services/convertTime");

function filterReportsHelper(data) {
    let { start_date, end_date, search } = data
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

function searchOrganizerNameHelper(reports, search) {
    const regex = new RegExp(search, 'i');

    const filteredReports = reports.filter(report => {
        const fullName = `${report.organizer_id.user_id.name.first_name} ${report.organizer_id.user_id.name.last_name}`;
        return regex.test(fullName);
    });

    return filteredReports;
}

module.exports = {
    filterReportsHelper,
    searchOrganizerNameHelper
}