const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const checkAdmin = require('../../../middlewares/checkAdmin');
const { httpGetOrganizersRequests, httpGetOrganizerRequest, httpAcceptOrganizerRequest, httpDenyOrganizerRequest } = require('./organizers-requests.controller');

const organizersRequestsRouter = express.Router();

organizersRequestsRouter.get('/organizers-requests', requireJwtAuth, checkAdmin, asyncHandler(httpGetOrganizersRequests))
organizersRequestsRouter.get('/organizers-requests/:id', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpGetOrganizerRequest))
organizersRequestsRouter.post('/organizers-requests/:id/accept', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpAcceptOrganizerRequest))
organizersRequestsRouter.post('/organizers-requests/:id/deny', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpDenyOrganizerRequest))

module.exports = organizersRequestsRouter;