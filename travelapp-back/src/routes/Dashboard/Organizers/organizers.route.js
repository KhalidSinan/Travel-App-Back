const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const checkAdmin = require('../../../middlewares/checkAdmin');
const checkOrganizersAdmin = require('../../../middlewares/checkOrganizersAdmin');

const { httpGetAllOrganizers, httpGetOneOrganizer, httpDeleteOrganizer, httpDeactivateOrganizer, httpSearchOrganizers, httpAlertOrganizer, httpGetOneOrganizerTripDetails } = require('./organizers.controller');

const organizersRouter = express.Router();

organizersRouter.get('/organizers', requireJwtAuth, checkAdmin, checkOrganizersAdmin, asyncHandler(httpGetAllOrganizers))
organizersRouter.get('/organizers/search', requireJwtAuth, checkAdmin, checkOrganizersAdmin, asyncHandler(httpSearchOrganizers))
organizersRouter.get('/organizers/:id', requireJwtAuth, checkAdmin, checkOrganizersAdmin, checkObjectID, asyncHandler(httpGetOneOrganizer))
organizersRouter.get('/organizers/:id/trips/:id2', requireJwtAuth, checkAdmin, checkOrganizersAdmin, checkObjectID, asyncHandler(httpGetOneOrganizerTripDetails))
organizersRouter.delete('/organizers/:id', requireJwtAuth, checkAdmin, checkOrganizersAdmin, checkObjectID, asyncHandler(httpDeleteOrganizer))
organizersRouter.get('/organizers/:id/deactivate', requireJwtAuth, checkAdmin, checkOrganizersAdmin, checkObjectID, asyncHandler(httpDeactivateOrganizer))
organizersRouter.post('/organizers/:id/alert', requireJwtAuth, checkAdmin, checkOrganizersAdmin, checkObjectID, asyncHandler(httpAlertOrganizer))

module.exports = organizersRouter;