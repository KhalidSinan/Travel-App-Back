const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const checkOrganizer = require('../../../middlewares/checkOrganizer');
const { httpGetAllOrganizedTrips, httpCreateOrganizedTrip, httpGetOneOrganizedTrip, httpGetMyOrganizedTrips, httpMakeDiscountOrganizedTrip, httpCancelOrganizedTrip, httpReviewOrganizedTrip, httpMakeOrganizedTripAnnouncement } = require('./organized-trips.controller');

const organizedTripRouter = express.Router();

// Get All Trips (user)
organizedTripRouter.get('/', requireJwtAuth, asyncHandler(httpGetAllOrganizedTrips))
// Create Trip (organizer)
organizedTripRouter.post('/create', requireJwtAuth, checkOrganizer, asyncHandler(httpCreateOrganizedTrip))
// Get My trips (organizer)
organizedTripRouter.get('/my', requireJwtAuth, checkOrganizer, asyncHandler(httpGetMyOrganizedTrips))
// Get Trip Details (Both)
organizedTripRouter.get('/:id', requireJwtAuth, checkObjectID, asyncHandler(httpGetOneOrganizedTrip))
// Cancel Trip (Organizer)
organizedTripRouter.delete('/:id', requireJwtAuth, checkObjectID, checkOrganizer, asyncHandler(httpCancelOrganizedTrip))
// make discount (organizer)
organizedTripRouter.post('/:id/discount', requireJwtAuth, checkObjectID, checkOrganizer, asyncHandler(httpMakeDiscountOrganizedTrip))
// Review trip (user)
organizedTripRouter.post('/:id/review', requireJwtAuth, checkObjectID, asyncHandler(httpReviewOrganizedTrip))
// make announcement (organizer)
organizedTripRouter.post('/:id/announcement', requireJwtAuth, checkObjectID, checkOrganizer, asyncHandler(httpMakeOrganizedTripAnnouncement))


module.exports = organizedTripRouter;