const express = require('express')
const asyncHandler = require('express-async-handler');
const { httpGetAllAnnouncements, httpPostAnnouncement } = require('./announcements.controller');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin');

const announcementRouter = express.Router();

announcementRouter.get('/announcements', requireJwtAuth, checkAdmin, asyncHandler(httpGetAllAnnouncements))
announcementRouter.post('/announcements', requireJwtAuth, checkAdmin, asyncHandler(httpPostAnnouncement))

// Maybe
// announcementRouter.get('/search', requireJwtAuth, asyncHandler(httpMarkNotification))

module.exports = announcementRouter;