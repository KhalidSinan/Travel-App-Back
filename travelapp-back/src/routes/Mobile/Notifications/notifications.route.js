const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const { httpGetAllNotifications, httpMarkNotification } = require('./notifications.controller');

const notificationRouter = express.Router();

notificationRouter.get('/', requireJwtAuth, asyncHandler(httpGetAllNotifications))
notificationRouter.get('/:id/read', requireJwtAuth, checkObjectID, asyncHandler(httpMarkNotification))

// Maybe
// notificationRouter.get('/search', requireJwtAuth, asyncHandler(httpMarkNotification))

module.exports = notificationRouter;