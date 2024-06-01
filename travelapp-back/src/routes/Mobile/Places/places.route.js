const asyncHandler = require('express-async-handler');
const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');
const express = require('express');
const router = express.Router();


const { getAllByCity, getAllNearby } = require('./places.controller');

router.get('/city', requireJwtAuth, asyncHandler(getAllByCity));
router.get('/nearby', requireJwtAuth, asyncHandler(getAllNearby));


module.exports = router;
