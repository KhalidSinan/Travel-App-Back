const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');

const { makeTrip, payTrip, getAllTrips, getOneTrip, httpRemoveActivityFromSchedule, httpDeleteTrip, httpShareTrip, httpCancelTrip, httpAutogenerateScheduleForTrip, httpAutogenerateTrip, httpAddActivityToSchedule, httpNotifyActivity, httpGetTripSchedule } = require('./trips.controller')

const tripRouter = express.Router();

tripRouter.get('/', requireJwtAuth, asyncHandler(getAllTrips))
tripRouter.post('/create', requireJwtAuth, asyncHandler(makeTrip))
tripRouter.post('/autogenerate/schedule', requireJwtAuth, asyncHandler(httpAutogenerateScheduleForTrip))
// tripRouter.post('/autogenerate', requireJwtAuth, asyncHandler(httpAutogenerateTrip))
tripRouter.get('/:id', requireJwtAuth, checkObjectID, asyncHandler(getOneTrip))
tripRouter.get('/:id/pay', checkObjectID, asyncHandler(payTrip))
tripRouter.get('/:id/remove/:activityID', requireJwtAuth, checkObjectID, asyncHandler(httpRemoveActivityFromSchedule))
tripRouter.delete('/:id', requireJwtAuth, checkObjectID, asyncHandler(httpDeleteTrip))
tripRouter.post('/:id/add-activity', requireJwtAuth, checkObjectID, asyncHandler(httpAddActivityToSchedule))
tripRouter.get('/:id/share', requireJwtAuth, checkObjectID, asyncHandler(httpShareTrip))
tripRouter.get('/:id/cancel', requireJwtAuth, checkObjectID, asyncHandler(httpCancelTrip))
tripRouter.post('/:id/notify/:activityID', requireJwtAuth, checkObjectID, asyncHandler(httpNotifyActivity))
tripRouter.get('/:id/schedule', requireJwtAuth, checkObjectID, asyncHandler(httpGetTripSchedule))
// review
// tripRouter.get('/:id/cancel', requireJwtAuth, checkObjectID, asyncHandler(httpCancelTrip))

module.exports = tripRouter;