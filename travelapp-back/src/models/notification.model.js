const Notification = require('./notifications.mongo')

// Add notification
async function postNotification(data) {
    await Notification.create(data);
}

// get all notifications for user
async function getNotificationsForUser(user_id) {
    return await Notification.find({
        $or: [
            { user_id: user_id },
            { is_global: true }
        ]
    }).select('-user_id').sort({ 'created_at': -1 })
}

// get one notification
async function getNotification(user_id, notification_identifier) {
    return await Notification.find({ user_id, notification_identifier })
}

// mark notification as read
async function putIsRead(notification_id, is_read) {
    await Notification.findByIdAndUpdate(notification_id, { is_read })
}

async function getNotifications() {
    return await Notification.find({ is_global: true })
}

async function getNotificationByID(id) {
    return await Notification.findById(id)
}

module.exports = {
    postNotification,
    getNotificationsForUser,
    getNotification,
    putIsRead,
    getNotifications,
    getNotificationByID
}