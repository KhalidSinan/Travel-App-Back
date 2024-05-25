const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');

const organizedTripRouter = express.Router();

organizedTripRouter.post('/reserve/:id', requireJwtAuth, asyncHandler())

module.exports = organizedTripRouter;