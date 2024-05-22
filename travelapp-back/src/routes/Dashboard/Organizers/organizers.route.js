const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const checkAdmin = require('../../../middlewares/checkAdmin');
const { httpGetAllOrganizers, httpGetOneOrganizer, httpAcceptOrganizer, httpDeleteOrganizer, httpDenyOrganizer, httpDeactivateOrganizer } = require('./organizers.controller');

const organizersRouter = express.Router();

organizersRouter.get('/organizers', requireJwtAuth, checkAdmin, asyncHandler(httpGetAllOrganizers))
organizersRouter.get('/organizers/:id', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpGetOneOrganizer))
organizersRouter.post('/accept-organizer', requireJwtAuth, checkAdmin, asyncHandler(httpAcceptOrganizer))
organizersRouter.post('/deny-organizer', requireJwtAuth, checkAdmin, asyncHandler(httpDenyOrganizer))
organizersRouter.delete('/organizers/:id', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpDeleteOrganizer))
organizersRouter.get('/organizers/:id/deactivate', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpDeactivateOrganizer))

module.exports = organizersRouter;