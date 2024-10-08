const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const checkOrganizer = require('../../../middlewares/checkOrganizer');
const { httpGetAllOrganizedTrips, httpCreateOrganizedTrip, httpGetOneOrganizedTrip, httpGetMyOrganizedTrips, httpCancelOrganizedTrip, httpGetCountriesWithContinents, httpGetCountries, httpGetOneOrganizedTripSchedule, httpRateOrganizer } = require('./organized-trips.controller');

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
// Get Trip Schedule (Both)
organizedTripRouter.get('/:id/schedule', requireJwtAuth, checkObjectID, asyncHandler(httpGetOneOrganizedTripSchedule))
// Cancel Trip (Organizer)
organizedTripRouter.delete('/:id', requireJwtAuth, checkObjectID, checkOrganizer, asyncHandler(httpCancelOrganizedTrip))
// Rate Organizer (user)
organizedTripRouter.post('/:id/rate', requireJwtAuth, checkObjectID, asyncHandler(httpRateOrganizer))

module.exports = organizedTripRouter;