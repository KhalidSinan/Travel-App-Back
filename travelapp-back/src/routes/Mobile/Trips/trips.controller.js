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

module.exports = {
    makeTrip,
    getAllTrips,
    getOneTrip,
    updateSchedule
};
