function reportDataOnApp(report) {
    const name = report.user_id['name'].first_name + ' ' + report.user_id['name'].last_name
    return {
        id: report._id,
        user: name,
        report_title: report.report_title,
        report_message: report.report_message,
        sent_at: new Date(report.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')
    }
}

// report on organizer
function reportDataOnOrganizer(report) {
    const name = report.user_id['name'].first_name + ' ' + report.user_id['name'].last_name
    const organizer_name = report.organizer_id['name'].first_name + ' ' + report.organizer_id['name'].last_name
    return {
        id: report._id,
        user: name,
        report_title: report.report_title,
        report_message: report.report_message,
        organizer_id: report.organizer_id._id,
        organizer_name: organizer_name,
        sent_at: new Date(report.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')
    }
}
module.exports = {
    reportDataOnApp,
    reportDataOnOrganizer
}