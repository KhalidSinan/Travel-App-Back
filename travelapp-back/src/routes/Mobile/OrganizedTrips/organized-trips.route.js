const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const checkOrganizer = require('../../../middlewares/checkOrganizer');
const { httpGetAllOrganizedTrips, httpCreateOrganizedTrip, httpGetOneOrganizedTrip } = require('./organized-trips.controller');

const organizedTripRouter = express.Router();

organizedTripRouter.get('/', requireJwtAuth, asyncHandler(httpGetAllOrganizedTrips))
organizedTripRouter.post('/create', requireJwtAuth, checkOrganizer, asyncHandler(httpCreateOrganizedTrip))
organizedTripRouter.get('/:id', requireJwtAuth, checkObjectID, asyncHandler(httpGetOneOrganizedTrip))

module.exports = organizedTripRouter;