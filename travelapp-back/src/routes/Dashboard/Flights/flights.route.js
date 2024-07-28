const express = require('express');

const asyncHandler = require('express-async-handler');
const checkObjectID = require('../../../middlewares/checkObjectID');
const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin');
const { httpGetHotelData } = require('./hotels.controller');

const flightRouter = express.Router();

flightRouter.get('/hotels/:id', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpGetHotelData));

module.exports = flightRouter;