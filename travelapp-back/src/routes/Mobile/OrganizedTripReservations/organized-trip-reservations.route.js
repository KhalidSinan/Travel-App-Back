const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const { httpGetMyReservationsUser, httpMakeReservation, httpGetAllReservationsForTrip, httpGetMyReservationsForTrip } = require('./organized-trip-reservations.controller');
const checkOrganizer = require('../../../middlewares/checkOrganizer');

const organizedTripRouter = express.Router();

organizedTripRouter.get('/', requireJwtAuth, asyncHandler(httpGetMyReservationsUser))
organizedTripRouter.post('/:id/reserve', requireJwtAuth, checkObjectID, asyncHandler(httpMakeReservation))
organizedTripRouter.get('/:id/my', requireJwtAuth, checkObjectID, asyncHandler(httpGetMyReservationsForTrip))
organizedTripRouter.get('/:id', requireJwtAuth, checkObjectID, checkOrganizer, asyncHandler(httpGetAllReservationsForTrip))

module.exports = organizedTripRouter;