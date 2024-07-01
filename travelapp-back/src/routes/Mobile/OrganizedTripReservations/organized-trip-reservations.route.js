const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const { httpGetMyReservationsUser, httpMakeReservation, httpGetAllReservationsForTrip, httpGetMyReservationsForTrip, httpCancelReservation } = require('./organized-trip-reservations.controller');
const checkOrganizer = require('../../../middlewares/checkOrganizer');

const organizedTripReservationRouter = express.Router();

organizedTripReservationRouter.get('/', requireJwtAuth, asyncHandler(httpGetMyReservationsUser))
organizedTripReservationRouter.post('/:id/reserve', requireJwtAuth, checkObjectID, asyncHandler(httpMakeReservation))
organizedTripReservationRouter.get('/:id/my', requireJwtAuth, checkObjectID, asyncHandler(httpGetMyReservationsForTrip))
organizedTripReservationRouter.get('/:id', requireJwtAuth, checkObjectID, checkOrganizer, asyncHandler(httpGetAllReservationsForTrip))
organizedTripReservationRouter.post('/:id/cancel', requireJwtAuth, checkObjectID, asyncHandler(httpCancelReservation))


module.exports = organizedTripReservationRouter;