const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const { paymentSheet, executePayment } = require('./payments.controller');

const paymentRouter = express.Router();

// paymentRouter.get('/payment_sheet', asyncHandler(paymentSheet))
paymentRouter.get('/execute_payment', asyncHandler(executePayment))

module.exports = paymentRouter;