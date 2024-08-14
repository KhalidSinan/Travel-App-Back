const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin');
const { httpGetTop10Countries, httpGetUsersAgeStatistics, httpGetTop10Hotels, httpGetAllCountries, httpGetPercentageOfOrganizedTrips, httpGetAirlinesFlights, httpGetRevenue } = require('./statistics.controller');

const statisticsRouter = express.Router();

// get top 10 countries
statisticsRouter.get('/statistics/top-countries', requireJwtAuth, checkAdmin, asyncHandler(httpGetTop10Countries))
// get all countries
statisticsRouter.get('/statistics/countries', requireJwtAuth, checkAdmin, asyncHandler(httpGetAllCountries))
// get age of users
statisticsRouter.get('/statistics/users-age', requireJwtAuth, checkAdmin, asyncHandler(httpGetUsersAgeStatistics))
// get top 10 hotels
statisticsRouter.get('/statistics/top-hotels', requireJwtAuth, checkAdmin, asyncHandler(httpGetTop10Hotels))
// get percentage of organized trips
statisticsRouter.get('/statistics/organized-percentage', requireJwtAuth, checkAdmin, asyncHandler(httpGetPercentageOfOrganizedTrips))
// get airline trips
statisticsRouter.get('/statistics/airline-flights', requireJwtAuth, checkAdmin, asyncHandler(httpGetAirlinesFlights))
// get revenue
statisticsRouter.get('/statistics/revenue', requireJwtAuth, checkAdmin, asyncHandler(httpGetRevenue))

module.exports = statisticsRouter;