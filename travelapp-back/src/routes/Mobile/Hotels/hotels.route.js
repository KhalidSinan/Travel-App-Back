
const asyncHandler = require('express-async-handler');
const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const express = require('express');
const router = express.Router();


const { makeReservation, searchHotels, payReservation, getCountriesWithCities, getHotelsByCities, httpGetHotelReservations } = require('./hotels.controller');

router.get('/cities', asyncHandler(getCountriesWithCities));
router.post('/reserve', requireJwtAuth, asyncHandler(makeReservation));
router.get('/my-reservations', requireJwtAuth, asyncHandler(httpGetHotelReservations));
router.post('/search', requireJwtAuth, asyncHandler(searchHotels));
router.post('/search/cities', requireJwtAuth, asyncHandler(getHotelsByCities));
router.get('/reservation/:id/pay', checkObjectID, asyncHandler(payReservation));

module.exports = router;