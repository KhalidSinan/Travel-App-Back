const express = require('express')
const asyncHandler = require('express-async-handler');
const { httpGetAllAnnouncementsApp, httpPostAnnouncement, httpGetAllAnnouncementsOrganizer } = require('./announcements.controller');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin');
const checkAnnouncementsAdmin = require('../../../middlewares/checkAnnouncementsAdmin')

const announcementRouter = express.Router();

announcementRouter.get('/announcements/app', requireJwtAuth, checkAdmin, checkAnnouncementsAdmin, asyncHandler(httpGetAllAnnouncementsApp))
announcementRouter.get('/announcements/organizers', requireJwtAuth, checkAdmin, checkAnnouncementsAdmin, asyncHandler(httpGetAllAnnouncementsOrganizer))
announcementRouter.post('/announcements', requireJwtAuth, checkAdmin, checkAnnouncementsAdmin, asyncHandler(httpPostAnnouncement))

module.exports = announcementRouter;