const express = require('express');
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkSuperAdmin = require('../../../middlewares/checkSuperAdmin')
const checkAdmin = require('../../../middlewares/checkAdmin')
const checkObjectID = require('../../../middlewares/checkObjectID');
const { httpGetAllReports, httpDeleteReport } = require('./reports.controller');

const reportRouter = express.Router();

reportRouter.get('/reports', requireJwtAuth, checkSuperAdmin, asyncHandler(httpGetAllReports));
reportRouter.delete('/reports/:id', requireJwtAuth, checkSuperAdmin, checkObjectID, asyncHandler(httpDeleteReport));

module.exports = reportRouter;