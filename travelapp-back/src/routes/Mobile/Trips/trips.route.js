const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');

const tripRouter = express.Router();

tripRouter.post('/reserve', requireJwtAuth, asyncHandler(httpMakeReservation))

module.exports = tripRouter;