const { validationErrors } = require('../../../middlewares/validationErrors');
const { validatePostNotification } = require("./notifications.validation");
const sendPushNotification = require('../../../services/notifications');
const { getNotifications, postNotification } = require('../../../models/notification.model');
const { serializedData } = require('../../../services/serializeArray')
const { getAllDeviceTokens } = require('../../../models/users.model');
const { notificationData } = require('./notifications.serializer');

async function httpGetAllNotifications(req, res) {
    const notifications = await getNotifications();
    return res.status(200).json({
        data: serializedData(notifications, notificationData)
    })
}

async function httpPostNotification(req, res) {
    const { error } = validatePostNotification(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })

    // Saving Announcement in DB
    req.body.is_global = true;
    const notification = await postNotification(req.body);

    // Sending Notification For All Users
    let tokens = await getAllDeviceTokens();
    // await sendPushNotification(req.body.title, req.body.body, tokens)

    return res.status(200).json({
        message: 'Notification Sent',
        data: notification
    })
}


module.exports = {
    httpGetAllNotifications,
    httpPostNotification
}