const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const { httpGetMyReservations, httpMakeReservation, httpGetReservationsForTrip } = require('./organized-trip-reservations.controller');
const checkOrganizer = require('../../../middlewares/checkOrganizer');

const organizedTripRouter = express.Router();

organizedTripRouter.get('/', requireJwtAuth, asyncHandler(httpGetMyReservations))
organizedTripRouter.post('/reserve/:id', requireJwtAuth, checkObjectID, asyncHandler(httpMakeReservation))
organizedTripRouter.get('/:id', requireJwtAuth, checkObjectID, checkOrganizer, asyncHandler(httpGetReservationsForTrip))

module.exports = organizedTripRouter;