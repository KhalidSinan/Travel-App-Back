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
const { getTripsEndingToday } = require('../models/trips.model');
const { getOneOrganizedTripBasedOnTripID, getAllOrganizedTrips, getAllOrganizedTripForCron } = require('../models/organized-trips.model');
const { getOrganizedTripsReservationsUsersID } = require('../models/organized-trip-reservations.model');
const { getOrganizer } = require('../models/organizers.model');

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
                await sendPushNotification(title, body, tokens, '/myReservations-screen')
                await postNotification({ user_id: reservation.user_id, notification_title: title, notification_body: body, notification_identifier: `timeleft24-${reservation._id}` })
            }
        }
    })
})

// Task 3 : Update Room Availability
const updateRoomAvailability = schedule.scheduleJob('0 0 * * *', async () => {
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

// Task 4 : Send Notification In Case Trip Ends
const tripEnd = schedule.scheduleJob('0 */5 * * * *', async () => {
    const now = new Date()
    const start_of_day = new Date();
    start_of_day.setHours(3, 0, 0, 0);
    const end_of_day = new Date();
    end_of_day.setHours(26, 59, 59, 999);

    const trips = await getTripsEndingToday(start_of_day, end_of_day)
    trips.forEach(async trip => {
        const endDate = new Date(trip.end_date);
        if (endDate.getMinutes() == now.getMinutes()) {
            console.log(`Trip ${trip.id} ended at ${trip.end_date}`);
            const tokens = await getDeviceTokens(trip.user_id)
            await sendToOrganizedTripParticipants(trip._id, 1)
            await sendPushNotification(
                'Trip Ended',
                'Your Trip Has Ended',
                tokens,
                '/shareTrip-screen',
                { id: trip.id }
            )
        }
    })
})

// helper
async function sendToOrganizedTripParticipants(trip_id, option) {
    const organized_trip = await getOneOrganizedTripBasedOnTripID(trip_id)
    if (!organized_trip) return
    const usersIDs = await getOrganizedTripsReservationsUsersID(organized_trip._id)
    const organizer = await getOrganizer(organized_trip.organizer_id)
    const name = organizer.user_id.name.first_name + ' ' + organizer.user_id.name.last_name;
    let tokens = []
    for (const user of usersIDs) {
        const tempTokens = await getDeviceTokens(user._id)
        tokens.push(...tempTokens)
    }
    if (option == 1)
        await sendPushNotification('Trip Ended', 'Rate Your Organizer', tokens, '/rateOrganizer-screen', { id: organized_trip._id, organizer_name: name })
    else if (option == 2)
        await sendPushNotification('Trip Near', 'Your Trip is About To Start', tokens, '/myTrips-screen')

}

// Task 5 : 
// Send Notification For Users Before Organized Trip Day
const beforeOrganizedTrip = schedule.scheduleJob('0 * * * *', async () => {
    const now = new Date();
    let tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const start_of_tomorrow = new Date(tomorrow);
    start_of_tomorrow.setHours(3, 0, 0, 0);
    const end_of_tomorrow = new Date(tomorrow);
    end_of_tomorrow.setHours(26, 59, 59, 999);

    const organized_trips = await getAllOrganizedTripForCron()
    organized_trips.forEach(async organized_trip => {
        const start_date = organized_trip.trip_id.start_date
        if (start_date.getHours() == now.getHours()) {
            await sendToOrganizedTripParticipants(organized_trip.trip_id, 2)
        }
    })
})