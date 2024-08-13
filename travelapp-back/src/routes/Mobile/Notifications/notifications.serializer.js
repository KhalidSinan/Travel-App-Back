function notificationData(notification) {
    return {
        notification_title: notification.notification_title,
        notification_body: notification.notification_body,
        is_read: notification.is_read,
        createdAt: notification.createdAt.toLocaleDateString()
    }
}

module.exports = {
    notificationData
}