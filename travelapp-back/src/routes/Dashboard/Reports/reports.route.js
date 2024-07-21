const express = require('express');
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkSuperAdmin = require('../../../middlewares/checkSuperAdmin')
const checkAdmin = require('../../../middlewares/checkAdmin')
const checkObjectID = require('../../../middlewares/checkObjectID');
const { httpGetAllReportsOnApp, httpDeleteReport, httpGetAllReportsOnOrganizers, httpReplyReport } = require('./reports.controller');

const reportRouter = express.Router();

reportRouter.get('/reports/app', requireJwtAuth, checkSuperAdmin, asyncHandler(httpGetAllReportsOnApp));
reportRouter.get('/reports/organizers', requireJwtAuth, checkSuperAdmin, asyncHandler(httpGetAllReportsOnOrganizers));
reportRouter.delete('/reports/:id', requireJwtAuth, checkSuperAdmin, checkObjectID, asyncHandler(httpDeleteReport));
reportRouter.get('/reports/:id/reply', requireJwtAuth, checkSuperAdmin, checkObjectID, asyncHandler(httpReplyReport));

module.exports = reportRouter;