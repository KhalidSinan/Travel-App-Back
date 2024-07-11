const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin');
const { httpGetTop10Countries, httpGetUsersAgeStatistics } = require('./statistics.controller');

const statisticsRouter = express.Router();

// get top 10 countries
statisticsRouter.get('/statistics/top-countries', requireJwtAuth, checkAdmin, asyncHandler(httpGetTop10Countries))
// get age of users
statisticsRouter.get('/statistics/users-age', requireJwtAuth, checkAdmin, asyncHandler(httpGetUsersAgeStatistics))

module.exports = statisticsRouter;