const express = require('express');
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin')
const checkObjectID = require('../../../middlewares/checkObjectID');

const { httpGetAllAnnouncementRequests, httpGetOneAnnouncementRequest, httpAcceptAnnouncementRequest, httpDenyAnnouncementRequest } = require('./announcement-requests.controller');
const announcementRequestRouter = express.Router();

announcementRequestRouter.get('/announcement-requests', requireJwtAuth, checkAdmin, asyncHandler(httpGetAllAnnouncementRequests));
announcementRequestRouter.get('/announcement-requests/:id', requireJwtAuth, checkObjectID, checkAdmin, asyncHandler(httpGetOneAnnouncementRequest));
announcementRequestRouter.get('/announcement-requests/:id/accept', requireJwtAuth, checkObjectID, checkAdmin, asyncHandler(httpAcceptAnnouncementRequest));
announcementRequestRouter.get('/announcement-requests/:id/deny', requireJwtAuth, checkObjectID, checkAdmin, asyncHandler(httpDenyAnnouncementRequest));

module.exports = announcementRequestRouter;