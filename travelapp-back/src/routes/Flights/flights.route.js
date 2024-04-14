const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../middlewares/checkJwtAuth');
const checkObjectID = require('../../middlewares/checkObjectID');
const { httpGetFlights, httpGetFlight, httpReserveFlight, httpConfirmReservation, httpCancelReservation, httpGetReservation } = require('./flights.controller');

const flightRouter = express.Router();

// add jwtStrategy middleware
flightRouter.get('/', requireJwtAuth, asyncHandler(httpGetFlights))
flightRouter.get('/:id', requireJwtAuth, checkObjectID, asyncHandler(httpGetFlight))
flightRouter.post('/:id', requireJwtAuth, checkObjectID, asyncHandler(httpReserveFlight))
flightRouter.post('/:id/confirm', requireJwtAuth, checkObjectID, asyncHandler(httpConfirmReservation))
flightRouter.post('/:id/cancel', requireJwtAuth, checkObjectID, asyncHandler(httpCancelReservation))
flightRouter.get('/reservation/:id', requireJwtAuth, checkObjectID, asyncHandler(httpGetReservation))

module.exports = flightRouter;