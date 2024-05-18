const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../middlewares/checkJwtAuth');
const checkObjectID = require('../../middlewares/checkObjectID');

const tripsRouter = express.Router();

tripsRouter.post('/reserve', requireJwtAuth, asyncHandler(httpMakeReservation))
tripsRouter.post('/confirm', requireJwtAuth, asyncHandler(httpConfirmReservation))
tripsRouter.get('/:id', requireJwtAuth, checkObjectID, asyncHandler(httpGetReservation))
tripsRouter.post('/:id/cancel', requireJwtAuth, checkObjectID, asyncHandler(httpCancelReservation))
tripsRouter.get('/:id/pay', checkObjectID, asyncHandler(httpPayReservation))

module.exports = tripsRouter;