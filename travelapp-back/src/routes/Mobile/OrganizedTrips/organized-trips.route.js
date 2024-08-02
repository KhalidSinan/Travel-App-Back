const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const checkOrganizer = require('../../../middlewares/checkOrganizer');
const { httpGetAllOrganizedTrips, httpCreateOrganizedTrip, httpGetOneOrganizedTrip, httpGetMyOrganizedTrips, httpMakeDiscountOrganizedTrip, httpCancelOrganizedTrip, httpReviewOrganizedTrip, httpMakeOrganizedTripAnnouncement, httpGetOrganizedTripAnnouncementOption, httpGetCountriesWithContinents, httpGetCountries } = require('./organized-trips.controller');

const organizedTripRouter = express.Router();

// Get All Trips (user)
organizedTripRouter.post('/', requireJwtAuth, asyncHandler(httpGetAllOrganizedTrips))
// Create Trip (organizer)
organizedTripRouter.post('/create', requireJwtAuth, checkOrganizer, asyncHandler(httpCreateOrganizedTrip))
// Get My trips (organizer)
organizedTripRouter.get('/my', requireJwtAuth, checkOrganizer, asyncHandler(httpGetMyOrganizedTrips))
// Get Countries With Continents
organizedTripRouter.get('/countries-continents', requireJwtAuth, asyncHandler(httpGetCountriesWithContinents))
// Get Countries
organizedTripRouter.get('/countries', requireJwtAuth, asyncHandler(httpGetCountries))
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
// make announcement (organizer)
organizedTripRouter.get('/:id/announcement/options', requireJwtAuth, checkObjectID, checkOrganizer, asyncHandler(httpGetOrganizedTripAnnouncementOption))


module.exports = organizedTripRouter;