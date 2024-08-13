const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const { httpGetAllAnnouncements, httpGetOrganizedTripAnnouncementOption, httpMakeOrganizedTripAnnouncement } = require('./announcements.controller');
const checkObjectID = require('../../../middlewares/checkObjectID');
const checkOrganizer = require('../../../middlewares/checkOrganizer');
const announcementRouter = express.Router();

announcementRouter.get('/home', requireJwtAuth, asyncHandler(httpGetAllAnnouncements))
announcementRouter.post('/:id', requireJwtAuth, checkObjectID, checkOrganizer, asyncHandler(httpMakeOrganizedTripAnnouncement))
announcementRouter.get('/:id/options', requireJwtAuth, checkObjectID, checkOrganizer, asyncHandler(httpGetOrganizedTripAnnouncementOption))

module.exports = announcementRouter;