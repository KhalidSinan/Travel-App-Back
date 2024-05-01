const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../middlewares/checkJwtAuth');
const checkObjectID = require('../../middlewares/checkObjectID');
const { httpGetFlights, httpGetFlight, httpReserveFlight, httpConfirmReservation, httpCancelReservation, httpGetReservation, httpGetSearchPageData } = require('./flights.controller');

const flightRouter = express.Router();

// const stripe = require('stripe')('sk_test_51P6snkRoWboogSYpbFBjBgi3C7KEDGr917wqgv373pPZSTGl0HGuqg3mKLg0qwAmrK64jDDh9Z9lXdT5nxa6edHx00rivbFM1g');

// add jwtStrategy middleware
flightRouter.get('/search', requireJwtAuth, asyncHandler(httpGetSearchPageData))
flightRouter.post('/search', requireJwtAuth, asyncHandler(httpGetFlights))
flightRouter.post('/reserve', requireJwtAuth, asyncHandler(httpReserveFlight))
flightRouter.get('/:id', requireJwtAuth, checkObjectID, asyncHandler(httpGetFlight))
flightRouter.post('/confirm', requireJwtAuth, asyncHandler(httpConfirmReservation))
flightRouter.post('/:id/cancel', requireJwtAuth, checkObjectID, asyncHandler(httpCancelReservation))
flightRouter.get('/reservation/:id', requireJwtAuth, checkObjectID, asyncHandler(httpGetReservation))

// flightRouter.post('/payment-sheet', async (req, res) => {
//     const { amount } = req.body
//     console.log('Hey')
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: amount,
//         currency: 'usd',
//         // automatic_payment_methods: {
//         //     enabled: true,
//         // },
//     })
//     console.log(paymentIntent)
//     // console.log(await stripe.confirmCardPayment(paymentIntent?.client_secret))
//     if (paymentIntent?.status !== 'completed') {
//         return res.status(200).json({
//             message: 'Confirm Payment',
//             client_secret: paymentIntent?.client_secret
//         })
//     }
//     return res.status(200).json({ message: 'Payment Completed Successfully' })
// });

module.exports = flightRouter;