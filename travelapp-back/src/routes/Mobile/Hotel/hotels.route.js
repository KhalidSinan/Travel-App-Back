
const asyncHandler = require('express-async-handler');
const requireJwtAuth = require('../../middlewares/checkJwtAuth');
const checkObjectID = require('../../middlewares/checkObjectID');
const express = require('express');
const router = express.Router();


const { makeReservation, searchHotels } = require('./hotels.controller');

router.post('/reserve', makeReservation);
router.get('/search', searchHotels);

module.exports = router;
