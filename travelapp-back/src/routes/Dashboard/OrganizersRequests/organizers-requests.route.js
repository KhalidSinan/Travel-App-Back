const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const checkAdmin = require('../../../middlewares/checkAdmin');
const checkOrganizersAdmin = require('../../../middlewares/checkOrganizersAdmin');

const { httpGetOrganizersRequests, httpGetOrganizerRequest, httpAcceptOrganizerRequest, httpDenyOrganizerRequest } = require('./organizers-requests.controller');

const organizersRequestsRouter = express.Router();

organizersRequestsRouter.get('/organizers-requests', requireJwtAuth, checkAdmin, checkOrganizersAdmin, asyncHandler(httpGetOrganizersRequests))
organizersRequestsRouter.get('/organizers-requests/:id', requireJwtAuth, checkAdmin, checkObjectID, checkOrganizersAdmin, asyncHandler(httpGetOrganizerRequest))
organizersRequestsRouter.get('/organizers-requests/:id/accept', requireJwtAuth, checkAdmin, checkOrganizersAdmin, checkObjectID, asyncHandler(httpAcceptOrganizerRequest))
organizersRequestsRouter.get('/organizers-requests/:id/deny', requireJwtAuth, checkAdmin, checkObjectID, checkOrganizersAdmin, asyncHandler(httpDenyOrganizerRequest))

module.exports = organizersRequestsRouter;