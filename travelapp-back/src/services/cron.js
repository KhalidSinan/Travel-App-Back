const schedule = require('node-schedule')
const mongoose = require('mongoose')
const createTrips = require('../generators/trips.generation');
const { getAllPlaneReservations } = require('../models/plane-reservation.model');
const { getFlight } = require('../models/flights.model');
const sendPushNotification = require('./notifications');
const { getDeviceTokens } = require('../models/users.model');
const { getNotification, postNotification } = require('../models/notification.model');
const HotelReservation = require('../models/hotel-reservation.mongo');
const Hotel = require('../models/hotels.mongo');

// Just Remove Comment

// Task 1 : Add Trips To DB Daily 5K each day
const AddTrips = schedule.scheduleJob('* * 0 0 0', async function () {
    createTrips(1000)
})

// Task 2 : Send Notifications For Reservations Not Confirmed
const SendConfirmationReminder = schedule.scheduleJob('0 */5 * * * *', async function () {
    const title = 'Confirm Your Reservation!!'
    const body = 'Less Than 24 hours left to confirm your reservation'
    const reservations = await getAllPlaneReservations();
    reservations.forEach(async reservation => {
        const tokens = await getDeviceTokens(reservation.user_id);
        const flight = await getFlight(reservation.flights[0]);
        if (!await getNotification(reservation.user_id, `timeleft24-${reservation._id}`)) {
            if (flight.departure_date - Date.now() < 1000 * 60 * 60 * 24) {
                // await sendPushNotification(title, body, tokens)
            }
            await postNotification({ user_id: reservation.user_id, notification_title: title, notification_body: body, notification_identifier: `timeleft24-${reservation._id}` })
        }
    })
})

// Task 3 : Update Room Availability
const updateRoomAvailability = schedule.scheduleJob('0 0 * * *', async () => {
    console.log('ss')
    console.log('Running the daily room availability update');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const endingReservations = await HotelReservation.find({
        end_date: { $gte: today, $lt: tomorrow }
    });

    const session = await Hotel.startSession();
    session.startTransaction();
    try {
        for (const reservation of endingReservations) {
            const hotel = await Hotel.findById(reservation.hotel_id).session(session);
            if (!hotel) continue;

            for (const roomCode of reservation.room_codes) {
                const roomType = hotel.room_types.find(room => room.code === roomCode);
                if (roomType) {
                    await Hotel.updateOne(
                        { _id: hotel._id, "room_types.code": roomType.code },
                        { $inc: { "room_types.$.available_rooms": 1 } },
                        { session }
                    );
                }
            }
        }
        await session.commitTransaction();
        console.log('Daily Room Update Finished')
    } catch (err) {
        await session.abortTransaction();
        console.error("Error updating room availability:", err);
    } finally {
        session.endSession();
    }
})