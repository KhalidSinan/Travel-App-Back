function notificationData(notification) {
    return {
        id: notification._id,
        notification_title: notification.notification_title,
        notification_body: notification.notification_body,
        created_at: notification.createdAt
    }
}

module.exports = {
    notificationData
}