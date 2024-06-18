const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');

const { makeTrip, payTrip } = require('./trips.controller')

const tripRouter = express.Router();

tripRouter.post('/create-trip', requireJwtAuth, asyncHandler(makeTrip))
tripRouter.get('/pay', asyncHandler(payTrip))

module.exports = tripRouter;