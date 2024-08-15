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
    }).select('-user_id').sort({ 'createdAt': -1 })
}

// get one notification
async function getNotification(user_id, notification_identifier) {
    return await Notification.find({ user_id, notification_identifier })
}

async function getNotifications(skip, limit, sort, filter) {
    let query = { is_global: true };
    if (Object.keys(filter).length > 0) Object.assign(query, filter);
    let notifications = Notification.find(query).skip(skip).limit(limit)
    if (sort && (sort == 'asc' || sort == 'desc')) notifications = await notifications.sort({ createdAt: sort })
    return notifications
}

async function getNotificationsCount(filter) {
    let query = { is_global: true };
    if (Object.keys(filter).length > 0) Object.assign(query, filter);
    return Notification.find(query).countDocuments()
}

async function getNotificationByID(id) {
    return await Notification.findById(id)
}

module.exports = {
    postNotification,
    getNotificationsForUser,
    getNotification,
    getNotifications,
    getNotificationByID,
    getNotificationsCount
}