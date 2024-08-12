const express = require('express');
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const { httpGetOrganizers, httpPostReportOnApp, httpPostReportOnOrganizer } = require('./reports.controller');
const checkObjectID = require('../../../middlewares/checkObjectID');

const reportRouter = express.Router();

reportRouter.post('/app', requireJwtAuth, asyncHandler(httpPostReportOnApp));
reportRouter.post('/organizers/:id', requireJwtAuth, checkObjectID, asyncHandler(httpPostReportOnOrganizer));
reportRouter.get('/organizers', requireJwtAuth, asyncHandler(httpGetOrganizers));

module.exports = reportRouter;