const express = require('express');
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const { httpPostRating } = require('./ratings.controller');

const ratingRouter = express.Router();

ratingRouter.post('/', requireJwtAuth, asyncHandler(httpPostRating));

module.exports = ratingRouter;