const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../middlewares/checkJwtAuth');
const checkObjectID = require('../../middlewares/checkObjectID');
const { httpGetFlights, httpGetFlight, httpGetSearchPageData } = require('./flights.controller');

const flightRouter = express.Router();

// add jwtStrategy middleware
flightRouter.get('/search', requireJwtAuth, asyncHandler(httpGetSearchPageData))
flightRouter.post('/search', requireJwtAuth, asyncHandler(httpGetFlights))
flightRouter.get('/:id', requireJwtAuth, checkObjectID, asyncHandler(httpGetFlight))


module.exports = flightRouter;