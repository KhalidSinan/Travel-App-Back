const express = require('express')
const asyncHandler = require('express-async-handler');
const { httpGetAllAnnouncements, httpPostAnnouncement } = require('./announcements.controller');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin');
const checkAnnouncementsAdmin = require('../../../middlewares/checkAnnouncementsAdmin')

const announcementRouter = express.Router();

announcementRouter.get('/announcements', requireJwtAuth, checkAdmin, checkAnnouncementsAdmin, asyncHandler(httpGetAllAnnouncements))
announcementRouter.post('/announcements', requireJwtAuth, checkAdmin, checkAnnouncementsAdmin, asyncHandler(httpPostAnnouncement))

module.exports = announcementRouter;