const express = require('express');
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const { httpPostReport } = require('./reports.controller');

const reportRouter = express.Router();

reportRouter.post('/', requireJwtAuth, asyncHandler(httpPostReport));

module.exports = reportRouter;