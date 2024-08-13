function notificationSorterHelper(notifications) {
    const today = 1000 * 60 * 60 * 24 // 24hrs
    const yesterday = today * 2 // 48hrs
    const week = today * 7 // 7 days
    const month = today * 31 // 31 days
    const year = month * 12
    const categorizedNotifications = { today: [], yesterday: [], week: [], month: [], year: [], moreThanYear: [] };
    notifications.forEach(notification => {
        let temp = {
            notification_title: notification.notification_title,
            notification_body: notification.notification_body,
            created_at: notification.createdAt.toLocaleDateString(),
        }
        if (new Date() - notification.createdAt < today) categorizedNotifications.today.push(temp)
        else if (new Date() - notification.createdAt < yesterday) categorizedNotifications.yesterday.push(temp)
        else if (new Date() - notification.createdAt < week) categorizedNotifications.week.push(temp)
        else if (new Date() - notification.createdAt < month) categorizedNotifications.month.push(temp)
        else if (new Date() - notification.createdAt < year) categorizedNotifications.year.push(temp)
        else categorizedNotifications.moreThanYear.push(temp)
    });

    return categorizedNotifications
}

module.exports = {
    notificationSorterHelper
}