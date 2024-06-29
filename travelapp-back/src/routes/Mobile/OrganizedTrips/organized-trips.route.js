const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const checkOrganizer = require('../../../middlewares/checkOrganizer');
const { httpGetAllOrganizedTrips, httpCreateOrganizedTrip, httpGetOneOrganizedTrip, httpGetMyOrganizedTrips, httpMakeDiscountOrganizedTrip, httpCancelOrganizedTrip } = require('./organized-trips.controller');

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
organizedTripRouter.delete('/:id', requireJwtAuth, checkObjectID, asyncHandler(httpCancelOrganizedTrip))
// make discount (organizer)
organizedTripRouter.post('/:id/discount', requireJwtAuth, checkObjectID, asyncHandler(httpMakeDiscountOrganizedTrip))


// Update Schedule (Organizer)
// make announcement (organizer)
// Cancel Trip (User)
// Review trip (user)

module.exports = organizedTripRouter;