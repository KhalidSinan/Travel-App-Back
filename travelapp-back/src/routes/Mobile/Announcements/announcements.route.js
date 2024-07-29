const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const { httpGetAllAnnouncements } = require('./announcements.controller');

const announcementRouter = express.Router();

announcementRouter.get('/', requireJwtAuth, asyncHandler(httpGetAllAnnouncements))

module.exports = announcementRouter;