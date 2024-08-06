const express = require('express');
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const { httpPostReport, httpGetOrganizers } = require('./reports.controller');

const reportRouter = express.Router();

reportRouter.post('/', requireJwtAuth, asyncHandler(httpPostReport));
reportRouter.get('/organizers', requireJwtAuth, asyncHandler(httpGetOrganizers));

module.exports = reportRouter;