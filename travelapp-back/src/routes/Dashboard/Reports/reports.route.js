const express = require('express');
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin')
const checkReportsAdmin = require('../../../middlewares/checkReportsAdmin')
const checkObjectID = require('../../../middlewares/checkObjectID');
const { httpGetAllReportsOnApp, httpDeleteReport, httpGetAllReportsOnOrganizers, httpReplyReport } = require('./reports.controller');

const reportRouter = express.Router();

reportRouter.get('/reports/app', requireJwtAuth, checkAdmin, checkReportsAdmin, asyncHandler(httpGetAllReportsOnApp));
reportRouter.get('/reports/organizers', requireJwtAuth, checkAdmin, checkReportsAdmin, asyncHandler(httpGetAllReportsOnOrganizers));
reportRouter.delete('/reports/:id', requireJwtAuth, checkAdmin, checkReportsAdmin, checkObjectID, asyncHandler(httpDeleteReport));
reportRouter.get('/reports/:id/reply', requireJwtAuth, checkAdmin, checkReportsAdmin, checkObjectID, asyncHandler(httpReplyReport));

module.exports = reportRouter;