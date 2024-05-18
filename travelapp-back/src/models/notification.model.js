const Notifications = require('./notifications.mongo')

// Add notification
async function postNotification(data) {
    await Notifications.create(data);
}

// get all notifications
async function getNotifications(user_id) {
    return await Notifications.find({ user_id }).select('-user_id').sort({ 'created_at': -1 })
}

// get one notification
async function getNotification(user_id, notification_identifier) {
    return await Notifications.find({ user_id, notification_identifier })
}

// mark notification as read

module.exports = {
    postNotification,
    getNotifications,
    getNotification
}