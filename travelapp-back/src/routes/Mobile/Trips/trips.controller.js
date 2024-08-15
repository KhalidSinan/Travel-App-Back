const Trip = require('../../../models/trips.mongo');
const { getTrip, deleteTrip, shareTrip, removeActivityFromSchedule, addActivityToSchedule, getTripActivities, makeActivityNotify } = require('../../../models/trips.model');
const { makeTripValidation, validateAutogenerateSchedule, addActivityToScheduleValidation } = require("./trips.validation");
const createPaymentData = require('../../../services/payment');
const { paymentSheet } = require('../Payments/payments.controller');
const { getReservation } = require('../../../models/plane-reservation.model');
const { makeTripPlacesToVisitHelper, makeTripOverallPriceHelper, autogenerateScheduleForTripHelper, cancelTripHelper, addDaysToActivities, setNotificationDateForActivity } = require('./trips.helper');
const { getHotelReservation } = require("../../../models/hotel-reservation.model");
const { checkFlightsReservations } = require('../PlaneReservations/plane-reservations.helper')
const { checkHotelsReservations } = require('../Hotels/hotel.helper');
const { tripData, getTripScheduleDetails } = require('./trips.serializer');
const { serializedData } = require('../../../services/serializeArray');
const { getOneOrganizedTripBasedOnTripID } = require('../../../models/organized-trips.model');
require('dotenv').config()


// Done
async function makeTrip(req, res) {
    const { error } = makeTripValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let { overall_num_of_days, num_of_people, start_date, starting_place, destinations, flights, hotels } = req.body;

    try {
        const userId = req.user.id;
        const end_date = new Date(start_date);
        end_date.setDate(end_date.getDate() + overall_num_of_days);

        const places_to_visit = makeTripPlacesToVisitHelper(destinations)
        destinations = addDaysToActivities(destinations)

        if (!await checkFlightsReservations(flights)) return res.status(400).json({ message: 'Flight Reservation Not Found' })
        if (!await checkHotelsReservations(hotels)) return res.status(400).json({ message: 'Hotel Reservation Not Found' })

        let overall_price = await makeTripOverallPriceHelper(flights, hotels);
        let price_per_person = (overall_price / num_of_people).toFixed(2)
        const trip = new Trip({
            user_id: userId,
            overall_num_of_days,
            num_of_people,
            overall_price,
            price_per_person,
            start_date: new Date(start_date),
            end_date,
            starting_place,
            destinations,
            flights: flights,
            hotels: hotels,
            places_to_visit: places_to_visit,
        });

        let data = await trip.save();
        data = await Trip.findOne(data)
        res.status(201).json({ message: 'Trip created successfully', data: { id: data._id } });
    } catch (error) {
        console.error("Error saving trip:", error);
        res.status(500).json({ error: error.message });
    }
}

// Done
async function getAllTrips(req, res) {
    try {
        let trips = await Trip.find({ user_id: req.user.id }).select('-destinations._id')
        if (req.user.is_organizer) {
            let data = []
            for (const trip of trips) {
                const organized = await getOneOrganizedTripBasedOnTripID(trip._id)
                if (!organized) data.push(trip)
            }
            trips = data
        }
        res.status(200).json({
            message: 'Trips Found',
            data: serializedData(trips, tripData)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Serializer Needed
async function getOneTrip(req, res) {
    try {
        const tripId = req.params.id;
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (!trip.user_id.equals(req.user.id)) {
            return res.status(404).json({ message: 'No Access To This Trip' });
        }

        res.status(200).json({
            message: "Trip Retrieved Successfully",
            data: trip
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Done
async function httpRemoveActivityFromSchedule(req, res) {
    const trip = await getTrip(req.params.id)
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (!trip.user_id.equals(req.user._id)) return res.status(400).json({ message: 'No Access' })
    await removeActivityFromSchedule(trip._id, req.params.activityID)
    res.status(200).json({ message: 'Schedule Updated Successfully' });
}

// Done
async function httpAddActivityToSchedule(req, res) {
    const { error } = addActivityToScheduleValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const trip = await getTrip(req.params.id)
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (!trip.user_id.equals(req.user._id)) return res.status(400).json({ message: 'No Access' })
    const { city_name, place_id, day } = req.body
    await addActivityToSchedule(trip._id, city_name, place_id, day)
    res.status(200).json({ message: 'Activity Added Successfully' });
}

// Done
async function payTrip(req, res) {
    const { flights, hotels, overall_price } = await getTrip(req.params.id)
    // For loop on trip hotel reservations
    let items = [];
    let total_amount = 0

    // For loop on trip flight reservations
    let flightReservations = await Promise.all(flights.map(async (flightReservation) => {
        if (!await getReservation(flightReservation)) return res.status(400).json({ message: "Flight Reservation Not Found" })
        return getReservation(flightReservation)
    }));
    let hotelReservations = await Promise.all(hotels.map(async (hotelReservation) => {
        if (! await getHotelReservation(hotelReservation)) return res.status(400).json({ message: "Hotel Reservation Not Found" })
        return getHotelReservation(hotelReservation)
    }))

    flightReservations.forEach(async (flight) => {
        const data = flight.reservations.data
        if (flight.reservations_back && flight.reservations_back.data.length > 0) data.push(...flight.reservations_back.data)
        const payment_data_flight = createPaymentData(data, flight.overall_price, "flight")
        items.push(...payment_data_flight.transactions[0].item_list.items)
        total_amount += payment_data_flight.transactions[0].amount.total
    })

    hotelReservations.forEach(async (hotel) => {
        if (!hotel) return res.status(400).json({ message: 'Hotel Reservation Not Found' })
        const payment_data_hotel = createPaymentData(hotel.room_codes, hotel.room_price, "hotel")
        items.push(...payment_data_hotel.transactions[0].item_list.items)
        total_amount += payment_data_hotel.transactions[0].amount.total
    })

    // Add data into items
    const mergedPaymentData = {
        intent: 'sale',
        payer: { payment_method: 'paypal' },
        redirect_urls: {
            return_url: `https://5710-93-190-138-195.ngrok-free.app/payment/execute_payment?amount=${total_amount}&currency=USD`,
            cancel_url: `${process.env.URL}/payment/cancel`
        },
        "transactions": [{
            "item_list": {
                "items": items
            },
            "amount": {
                "currency": "USD",
                "total": total_amount
            },
            "description": "This is the payment for Both"
        }]
    };

    req.body.data = mergedPaymentData
    paymentSheet(req, res)
}

async function httpDeleteTrip(req, res) {
    const trip = await getTrip(req.params.id)
    if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
    }
    if (!trip.user_id.equals(req.user.id)) {
        return res.status(404).json({ message: 'No Access To This Trip' });
    }

    await deleteTrip(req.params.id)
    return res.status(200).json({ message: 'Trip Deleted' });
}

async function httpShareTrip(req, res) {
    const trip = await getTrip(req.params.id)
    if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
    }
    if (!trip.user_id.equals(req.user.id)) {
        return res.status(404).json({ message: 'No Access To This Trip' });
    }

    await shareTrip(req.params.id)
    return res.status(200).json({ message: 'Trip Shared' });
}

// Done
async function httpCancelTrip(req, res) {
    const trip = await getTrip(req.params.id)
    if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
    }
    if (!trip.user_id.equals(req.user.id)) {
        return res.status(404).json({ message: 'No Access To This Trip' });
    }
    await cancelTripHelper(trip, trip._id)
    return res.status(200).json({ message: 'Trip Canceled' });
}

// Done
async function httpAutogenerateScheduleForTrip(req, res) {
    const { error } = validateAutogenerateSchedule(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let data = await autogenerateScheduleForTripHelper(req.body.destinations)
    return res.status(200).json({
        message: 'Schedule Autogenerated Successfully',
        data: data
    });
}

async function httpNotifyActivity(req, res) {
    let { notification_time = null } = req.body
    const trip = await getTripActivities(req.params.id);
    if (!trip) return res.status(400).json({ message: 'Trip Not Found' })
    if (!trip.user_id.equals(req.user._id)) return res.status(400).json({ message: 'No Access' })
    if (notification_time != null) notification_time = await setNotificationDateForActivity(trip, req.params.activityID, notification_time)
    await makeActivityNotify(req.params.id, req.params.activityID, notification_time)
    return res.status(200).json({ data: serializedData(trip.destinations, getTripScheduleDetails) })
}

async function httpGetTripSchedule(req, res) {
    const trip = await getTripActivities(req.params.id);
    if (!trip) return res.status(400).json({ message: 'Trip Not Found' })
    if (!trip.user_id.equals(req.user._id)) return res.status(400).json({ message: 'No Access' })

    return res.status(200).json({ data: serializedData(trip.destinations, getTripScheduleDetails) })
}


module.exports = {
    makeTrip,
    getAllTrips,
    getOneTrip,
    payTrip,
    httpDeleteTrip,
    httpShareTrip,
    httpCancelTrip,
    httpAutogenerateScheduleForTrip,
    httpRemoveActivityFromSchedule,
    httpAddActivityToSchedule,
    httpNotifyActivity,
    httpGetTripSchedule
};
