const express = require('express')
const asyncHandler = require('express-async-handler');
const { httpGetAllNotifications, httpPostNotification, httpResendNotification } = require('./notifications.controller');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin');
const checkNotificationsAdmin = require('../../../middlewares/checkNotificationsAdmin');

const notificationsRouter = express.Router();

notificationsRouter.get('/notifications', requireJwtAuth, checkAdmin, asyncHandler(httpGetAllNotifications))
notificationsRouter.post('/notifications', requireJwtAuth, checkAdmin, checkNotificationsAdmin, asyncHandler(httpPostNotification))
notificationsRouter.get('/notifications/:id/resend', requireJwtAuth, checkAdmin, checkNotificationsAdmin, asyncHandler(httpResendNotification))

module.exports = notificationsRouter;