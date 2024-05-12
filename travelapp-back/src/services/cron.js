const schedule = require('node-schedule')
const mongoose = require('mongoose')
const createTrips = require('../generators/Trips/trips.generation');
const { getAllPlaneReservations } = require('../models/plane-reservation.model');
const { getFlight } = require('../models/flights.model');
const sendPushNotification = require('./notifications');
const { getDeviceTokens } = require('../models/users.model');
const { getNotification, postNotification } = require('../models/notification.model');

// Just Remove Comment

// Task 1 : Add Trips To DB Daily 5K each day
// const AddTrips = schedule.scheduleJob('* * * * * *', async function () {
//     createTrips(1)
// })

// Task 2 : Send Notifications For Reservations Not Confirmed
// const SendConfirmationReminder = schedule.scheduleJob('0 */5 * * * *', async function () {
//     const title = 'Confirm Your Reservation!!'
//     const body = 'Less Than 24 hours left to confirm your reservation'
//     const reservations = await getAllPlaneReservations();
//     reservations.forEach(async reservation => {
//         const tokens = await getDeviceTokens(reservation.user_id);
//         const flight = await getFlight(reservation.flights[0]);
//         if (!await getNotification(reservation.user_id, `timeleft24-${reservation._id}`)) {
//             if (flight.departure_date - Date.now() < 1000 * 60 * 60 * 24) {
//                 sendPushNotification(title, body, tokens)
//             }
//             await postNotification({ user_id: reservation.user_id, notification_title: title, notification_body: body, notification_identifier: `timeleft24-${reservation._id}` })
//         }
//     })
// })