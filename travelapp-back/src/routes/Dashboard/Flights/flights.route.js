const express = require('express');

const asyncHandler = require('express-async-handler');
const checkObjectID = require('../../../middlewares/checkObjectID');
const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin');
const { httpGetFlights, httpSearchFlight } = require('./flights.controller');

const flightRouter = express.Router();

flightRouter.get('/flights', requireJwtAuth, checkAdmin, asyncHandler(httpGetFlights));
flightRouter.get('/flights/search', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpSearchFlight));

module.exports = flightRouter;