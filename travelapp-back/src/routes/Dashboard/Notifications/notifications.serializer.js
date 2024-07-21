function notificationData(notification) {
    return {
        notification_title: notification.notification_title,
        notification_body: notification.notification_body,
        createdAt: notification.createdAt
    }
}

module.exports = {
    notificationData
}