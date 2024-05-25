
const asyncHandler = require('express-async-handler');
const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const express = require('express');
const router = express.Router();


const { makeReservation, searchHotels, getHotels } = require('./hotels.controller');

router.post('/reserve', requireJwtAuth, asyncHandler(makeReservation));
router.get('/search', requireJwtAuth, asyncHandler(searchHotels));


module.exports = router;
