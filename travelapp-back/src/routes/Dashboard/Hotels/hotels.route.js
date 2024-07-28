const express = require('express');

const asyncHandler = require('express-async-handler');
const checkObjectID = require('../../../middlewares/checkObjectID');
const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkAdmin = require('../../../middlewares/checkAdmin');
const { httpGetHotelData, httpGetHotels } = require('./hotels.controller');

const hotelRouter = express.Router();

hotelRouter.get('/hotels', requireJwtAuth, checkAdmin, asyncHandler(httpGetHotels));
hotelRouter.get('/hotels/:id', requireJwtAuth, checkAdmin, checkObjectID, asyncHandler(httpGetHotelData));

module.exports = hotelRouter;