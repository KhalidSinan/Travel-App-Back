const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const { httpMakeReservation, httpConfirmReservation, httpCancelReservation, httpPayReservation, httpGetReservation, httpGetNextDestination, httpGetMyReservations } = require('./plane-reservations.controller');

const planeReservationRouter = express.Router();

planeReservationRouter.post('/reserve', requireJwtAuth, asyncHandler(httpMakeReservation))
planeReservationRouter.post('/confirm', requireJwtAuth, asyncHandler(httpConfirmReservation))
planeReservationRouter.get('/next-destination', requireJwtAuth, asyncHandler(httpGetNextDestination))
planeReservationRouter.get('/my-reservations', requireJwtAuth, asyncHandler(httpGetMyReservations))
planeReservationRouter.get('/:id', requireJwtAuth, checkObjectID, asyncHandler(httpGetReservation))
planeReservationRouter.post('/:id/cancel', requireJwtAuth, checkObjectID, asyncHandler(httpCancelReservation))
planeReservationRouter.get('/:id/pay', checkObjectID, asyncHandler(httpPayReservation))

module.exports = planeReservationRouter;