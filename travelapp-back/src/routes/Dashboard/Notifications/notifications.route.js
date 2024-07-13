const express = require('express')
const asyncHandler = require('express-async-handler');
const { httpGetAllNotifications, httpPostNotification } = require('./notifications.controller');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin');

const notificationsRouter = express.Router();

notificationsRouter.get('/notifications', requireJwtAuth, checkAdmin, asyncHandler(httpGetAllNotifications))
notificationsRouter.post('/notifications', requireJwtAuth, checkAdmin, asyncHandler(httpPostNotification))

module.exports = notificationsRouter;