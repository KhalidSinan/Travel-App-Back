const { getNotificationsForUser, putIsRead } = require("../../../models/notification.model");
const { notificationSorterHelper } = require("./notifications.helper");
const { validatePutIsRead } = require("./notifications.validation");
const { validationErrors } = require('../../../middlewares/validationErrors');
const { serializedData } = require("../../../services/serializeArray");
const { notificationData } = require("./notifications.serializer");


async function httpGetAllNotifications(req, res) {
    const user_id = req.user._id;
    let notifications = await getNotificationsForUser(user_id)
    notifications = notificationSorterHelper(notifications)
    return res.status(200).json({
        ...notifications,
    })
}

async function httpMarkNotification(req, res) {
    await putIsRead(req.params.id, true);
    return res.status(200).json({
        message: 'Notification Marked As Read',
    })
}


module.exports = {
    httpGetAllNotifications,
    httpMarkNotification
}