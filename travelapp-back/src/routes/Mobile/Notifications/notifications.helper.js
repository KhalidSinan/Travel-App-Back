function notificationSorterHelper(notifications) {
    const today = 1000 * 60 * 60 * 24 // 24hrs
    const yesterday = today * 2 // 48hrs
    const week = today * 7 // 7 days
    const month = today * 31 // 31 days
    const year = month * 12

    const categorizedNotifications = { today: [], yesterday: [], week: [], month: [], year: [], moreThanYear: [] };

    notifications.forEach(notification => {
        if (Date.now() - +notification.createdAt < today) categorizedNotifications.today.push(notification)
        else if (Date.now() - +notification.createdAt < yesterday) categorizedNotifications.yesterday.push(notification)
        else if (Date.now() - +notification.createdAt < week) categorizedNotifications.week.push(notification)
        else if (Date.now() - +notification.createdAt < month) categorizedNotifications.month.push(notification)
        else if (Date.now() - +notification.createdAt < year) categorizedNotifications.year.push(notification)
        else categorizedNotifications.moreThanYear.push(notification)
    });

    return categorizedNotifications
}

module.exports = {
    notificationSorterHelper
}