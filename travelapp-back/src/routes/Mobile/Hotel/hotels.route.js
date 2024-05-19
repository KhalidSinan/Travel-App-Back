
const express = require('express');
const asyncHandler = require('express-async-handler');
const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');

const { makeReservation, searchHotels } = require('./hotels.controller');

const router = express.Router();

router.get('/search', requireJwtAuth, asyncHandler(searchHotels));
router.post('/reserve', requireJwtAuth, asyncHandler(makeReservation));

module.exports = router;
