const mongoose = require('mongoose');
const Trip = require('../../../models/trips.mongo');
const Place = require('../../../models/places.mongo');
const User = require('../../../models/users.mongo');
const Hotel = require('../../../models/hotels.mongo');
const Flight = require('../../../models/flights.mongo');
const { validationErrors } = require('../../../middlewares/validationErrors');
const { updateScheduleValidation, makeTripValidation } = require("./trips.validation");

const makeTrip = async (req, res) => {
    const { error } = makeTripValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { overall_num_of_days, num_of_people, overall_price, start_date, starting_place, destinations, flights, hotels, places_to_visit } = req.body;

        const user = req.user
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const end_date = new Date(start_date);
        end_date.setDate(end_date.getDate() + overall_num_of_days);

        const trip = new Trip({
            user_id: mongoose.Types.ObjectId(user_id),
            overall_num_of_days,
            num_of_people,
            overall_price,
            start_date: new Date(start_date),
            end_date: end_date,
            starting_place,
            destinations,
            flights: flights.map(id => mongoose.Types.ObjectId(id)),
            hotels: hotels.map(id => mongoose.Types.ObjectId(id)),
            places_to_visit: places_to_visit.map(id => mongoose.Types.ObjectId(id)),
        });

        await trip.save();
        res.status(201).json({ message: 'Trip created successfully', trip });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('user_id', 'name.first_name -_id')
            .populate('flights', 'airline.name -_id')
            .populate('hotels', 'name -_id')
            .populate('places_to_visit', 'name - _id')
            .exec();
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOneTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const trip = await Trip.findById(tripId)
            .populate('user_id', 'name.first_name -_id')
            .populate('flights', 'airline.name -_id')
            .populate('hotels', 'name -_id')
            .populate('places_to_visit', 'name -_id')
            .exec();

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSchedule = async (req, res) => {
    const { error } = updateScheduleValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { tripId } = req.params;
        const { destinations, flights, hotels, places_to_visit } = req.body;

        const updatedTrip = await Trip.findByIdAndUpdate(tripId, {
            destinations,
            flights: flights.map(id => mongoose.Types.ObjectId(id)),
            hotels: hotels.map(id => mongoose.Types.ObjectId(id)),
            places_to_visit: places_to_visit.map(id => mongoose.Types.ObjectId(id)),
        }, { new: true })
            .populate('user_id', 'name.first_name -_id')
            .populate('flights', 'airline.name -_id')
            .populate('hotels', 'name -_id')
            .populate('places_to_visit', 'name -_id')
            .exec();

        if (!updatedTrip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.status(200).json({ message: 'Schedule updated successfully', updatedTrip });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPaymentData = require('../../../services/payment');
const { paymentSheet } = require('../Payments/payments.controller');
const { getReservation } = require('../../../models/plane-reservation.model');
const HotelReservation = require('../../../models/hotel-reservations.mongo');

const payTrip = async (req, res) => {
    const reservation_hotel = await HotelReservation.findById('665ee5b121526f99541a801f')
    if (!reservation_hotel) return res.status(400).json({ message: 'Reservation Not Found' })
    const payment_data_hotel = createPaymentData(reservation_hotel.room_codes, reservation_hotel.room_price, "hotel")
    // flight payment
    const reservation_flight = await getReservation('666c476abe9d4b82caadcba3')
    const data = reservation_flight.reservations.data
    if (reservation_flight.reservations_back && reservation_flight.reservations_back.data.length > 0) data.push(...reservation_flight.reservations_back.data)
    const payment_data_flight = createPaymentData(data, reservation_flight.overall_price, "flight")
    //
    const items = [...payment_data_hotel.transactions[0].item_list.items, ...payment_data_flight.transactions[0].item_list.items]
    const total_amount = payment_data_hotel.transactions[0].amount.total + payment_data_flight.transactions[0].amount.total
    const mergedPaymentData = {
        intent: 'sale',
        payer: { payment_method: 'paypal' },
        redirect_urls: {
            return_url: `https://12d5-5-155-190-163.ngrok-free.app/payment/execute_payment?amount=${total_amount}&currency=USD`,
            cancel_url: payment_data_hotel.redirect_urls.cancel_url
        },
        "transactions": [{
            "item_list": {
                "items": items
            },
            "amount": {
                "currency": payment_data_hotel.transactions[0].amount.currency,
                "total": total_amount
            },
            "description": "This is the payment for Both"
        }]
    };

    req.body.data = mergedPaymentData
    paymentSheet(req, res)
}

module.exports = {
    makeTrip,
    getAllTrips,
    getOneTrip,
    updateSchedule,
    payTrip
};
