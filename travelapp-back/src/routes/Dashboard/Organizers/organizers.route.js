const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const checkAdmin = require('../../../middlewares/checkAdmin');
const { httpGetAllOrganizers, httpGetOneOrganizer, httpDeleteOrganizer, httpDeactivateOrganizer, httpSearchOrganizers, httpAlertOrganizer } = require('./organizers.controller');

const organizersRouter = express.Router();

organizersRouter.get('/organizers', requireJwtAuth, checkAdmin, asyncHandler(httpGetAllOrganizers))
organizersRouter.get('/organizers/search', requireJwtAuth, checkAdmin, asyncHandler(httpSearchOrganizers))
organizersRouter.get('/organizers/:id', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpGetOneOrganizer))
organizersRouter.delete('/organizers/:id', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpDeleteOrganizer))
organizersRouter.get('/organizers/:id/deactivate', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpDeactivateOrganizer))
organizersRouter.post('/organizers/:id/alert', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpAlertOrganizer))

module.exports = organizersRouter;