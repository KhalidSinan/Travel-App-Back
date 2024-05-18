const { getNotifications } = require("../../../models/notification.model");
const { serializedData } = require("../../../services/serializeArray");
const { notificationSorterHelper } = require("./notifications.helper");

async function httpGetAllNotifications(req, res) {
    const user_id = req.user._id;
    const notifications = await getNotifications(user_id)
    return res.status(200).json({
        data: notificationSorterHelper(notifications)
    })
}

async function httpMarkNotification(req, res) {

}


module.exports = {
    httpGetAllNotifications,
    httpMarkNotification
}