const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const { httpGetAllNotifications, httpMarkNotification } = require('./notifications.controller');

const notificationRouter = express.Router();

notificationRouter.get('/', requireJwtAuth, asyncHandler(httpGetAllNotifications))

module.exports = notificationRouter;