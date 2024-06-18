
const asyncHandler = require('express-async-handler');
const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const express = require('express');
const router = express.Router();


const { makeReservation, searchHotels, payReservation, getCountriesWithCities } = require('./hotels.controller');

router.get('/cities', asyncHandler(getCountriesWithCities));
router.post('/reserve', requireJwtAuth, asyncHandler(makeReservation));
router.post('/search', requireJwtAuth, asyncHandler(searchHotels));
router.get('/reservation/:id/pay', checkObjectID, asyncHandler(payReservation));


module.exports = router;
