const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../middlewares/checkJwtAuth');
const checkObjectID = require('../../middlewares/checkObjectID');
const { httpGetFlights, httpGetFlight, httpReserveFlight, httpConfirmReservation, httpCancelReservation, httpGetReservation, httpGetSearchPageData, httpPayReservation } = require('./flights.controller');

const flightRouter = express.Router();

// add jwtStrategy middleware
flightRouter.get('/search', requireJwtAuth, asyncHandler(httpGetSearchPageData))
flightRouter.post('/search', requireJwtAuth, asyncHandler(httpGetFlights))
flightRouter.post('/reserve', requireJwtAuth, asyncHandler(httpReserveFlight))
flightRouter.get('/:id', requireJwtAuth, checkObjectID, asyncHandler(httpGetFlight))
flightRouter.post('/confirm', requireJwtAuth, asyncHandler(httpConfirmReservation))
flightRouter.post('/:id/cancel', requireJwtAuth, checkObjectID, asyncHandler(httpCancelReservation))
flightRouter.get('/reservation/:id', requireJwtAuth, checkObjectID, asyncHandler(httpGetReservation))
flightRouter.get('/reservation/:id/pay', checkObjectID, asyncHandler(httpPayReservation))

module.exports = flightRouter;