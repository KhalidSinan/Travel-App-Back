const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin');
const { httpGetTop10Countries, httpGetUsersAgeStatistics, httpGetTop10Hotels, httpGetAllCountries } = require('./statistics.controller');

const statisticsRouter = express.Router();

// get top 10 countries
statisticsRouter.get('/statistics/top-countries', requireJwtAuth, checkAdmin, asyncHandler(httpGetTop10Countries))
// get all countries
statisticsRouter.get('/statistics/countries', requireJwtAuth, checkAdmin, asyncHandler(httpGetAllCountries))
// get age of users
statisticsRouter.get('/statistics/users-age', requireJwtAuth, checkAdmin, asyncHandler(httpGetUsersAgeStatistics))
// get top 10 hotels
statisticsRouter.get('/statistics/top-hotels', requireJwtAuth, checkAdmin, asyncHandler(httpGetTop10Hotels))
// get revenue
// statisticsRouter.get('/statistics/revenue', requireJwtAuth, checkAdmin, asyncHandler(httpGetUsersAgeStatistics))

module.exports = statisticsRouter;