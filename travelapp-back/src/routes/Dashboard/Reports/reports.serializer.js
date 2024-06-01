function reportData(report) {
    const name = report.user_id['name'].first_name + ' ' + report.user_id['name'].last_name
    return {
        id: report._id,
        user: name,
        report_title: report.report_title,
        report_message: report.report_message,
    }
}

module.exports = {
    reportData
}