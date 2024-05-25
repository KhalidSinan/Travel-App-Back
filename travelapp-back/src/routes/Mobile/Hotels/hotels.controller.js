
const { validationErrors } = require('../../../middlewares/validationErrors');
const { searchHotelsValidation, reservationValidation } = require('./hotels.validation');
const { postReservation } = require("../../../models/hotel-reservations.model");
const { getPagination } = require('../../../services/query');
const { getAllHotel, getHotelById, findHotelsInCountry } = require("../../../models/hotels.model")
const { getUserById } = require("../../../models/users.model")
const HotelReservation = require('../../../models/hotel-reservations.mongo');
const Hotel = require('../../../models/hotels.mongo');
const { calculateTotalPrice } = require('./hotel.helper');


async function searchHotels(req, res) {
    const { nameOrCity, startDate, numDays, numRooms, stars, sortField = '', order = 'asc', page = 1 } = req.body;

    const { error } = searchHotelsValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    if (!nameOrCity) {
        return res.status(400).json({ error: "You must provide either the hotel name or the city name." });
    }

    let effectiveStartDate;
    if (startDate) {
        const [day, month, year] = startDate.split('/').map(Number);
        effectiveStartDate = new Date(year, month - 1, day);
    } else {
        effectiveStartDate = new Date();
    }
    effectiveStartDate.setHours(0, 0, 0, 0);

    let query = {
        $or: [
            { name: { $regex: new RegExp(nameOrCity, 'i') } },
            { 'location.city': { $regex: new RegExp(nameOrCity, 'i') } }
        ]
    };

    if (stars) {
        query.stars = stars;
    }

    const { skip, limit } = getPagination({ page, limit: 10 });

    let sortOptions = {};
    if (sortField === 'price') {
        sortOptions = { 'room_types.price': order === 'asc' ? 1 : -1 };
    } else if (sortField === 'stars') {
        sortOptions = { 'stars': order === 'asc' ? 1 : -1 };
    }

    const hotelsQuery = Hotel.find(query).skip(skip).limit(limit);
    const hotelsCount = await Hotel.find(query)

    if (Object.keys(sortOptions).length > 0) {
        hotelsQuery.sort(sortOptions);
    }

    const hotels = await hotelsQuery;

    console.log("Hotels found:", hotels.length);

    let response = {
        totalHotelsFound: hotelsCount,
        hotels: []
    };

    if (!startDate && !numDays && !numRooms) {
        response.hotels = hotels;
    } else if (numRooms && !numDays) {
        const suitableHotels = hotels.filter(hotel => {
            return hotel.room_types.some(roomType => roomType.available_rooms >= numRooms);
        });
        console.log("Suitable Hotels for numRooms:", suitableHotels.length);
        response.totalHotelsFound = suitableHotels.length;
        response.hotels = suitableHotels;
    } else if (numDays && !numRooms) {
        const endDate = new Date(effectiveStartDate.getTime() + numDays * 24 * 60 * 60 * 1000);
        const availableHotels = await Promise.all(hotels.map(async (hotel) => {
            const reservations = await HotelReservation.find({
                hotel_id: hotel._id,
                start_date: { $lte: endDate },
                end_date: { $gte: effectiveStartDate }
            });
            return reservations.length === 0 ? hotel : null;
        }));
        const filteredHotels = availableHotels.filter(Boolean);
        console.log("Available Hotels for numDays:", filteredHotels.length);
        response.totalHotelsFound = filteredHotels.length;
        response.hotels = filteredHotels;
    } else if (startDate && numDays && numRooms) {
        const endDate = new Date(effectiveStartDate.getTime() + numDays * 24 * 60 * 60 * 1000);
        const availableHotels = await Promise.all(hotels.map(async (hotel) => {
            const reservations = await HotelReservation.find({
                hotel_id: hotel._id,
                start_date: { $lte: endDate },
                end_date: { $gte: effectiveStartDate }
            });
            let totalReserved = reservations.reduce((acc, curr) => acc + curr.number_of_rooms, 0);
            let totalAvailable = hotel.rooms_number - totalReserved;

            const roomTypeAvailability = hotel.room_types.some(roomType => roomType.available_rooms >= numRooms);

            return (totalAvailable >= numRooms && roomTypeAvailability) ? hotel : null;
        }));
        const filteredHotels = availableHotels.filter(Boolean);
        console.log("Available Hotels for startDate, numDays, and numRooms:", filteredHotels.length);
        response.totalHotelsFound = filteredHotels.length;
        response.hotels = filteredHotels;
    }

    return res.json(response);
}

async function makeReservation(req, res) {
    const { error } = reservationValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { hotelId, roomCodes, userId, startDate, numDays } = req.body;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + numDays);


    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const roomTypes = roomCodes.map(code => hotel.room_types.find(room => room.code === code));
    if (roomTypes.some(roomType => !roomType || roomType.available_rooms < 1)) {
        return res.status(404).json({ message: "One or more rooms are not available" });
    }

    const conflictingReservations = await HotelReservation.find({
        hotel_id: hotelId,
        room_code: { $in: roomCodes },
        $or: [
            { start_date: { $lt: endDate }, end_date: { $gt: startDate } },
            { start_date: { $lt: endDate }, end_date: { $eq: startDate } },
            { start_date: { $eq: startDate }, end_date: { $gt: startDate } }
        ]
    });

    if (conflictingReservations.length > 0) {
        return res.status(400).json({ message: "One or more rooms are already booked for the specified dates" });
    }

    const calculatedTotalPrice = calculateTotalPrice(roomTypes, roomCodes, startDate, endDate);

    const newReservation = new HotelReservation({
        hotel_id: hotelId,
        user_id: userId,
        room_codes: roomCodes,
        start_date: startDate,
        end_date: endDate,
        room_price: calculatedTotalPrice,
        number_of_rooms: roomCodes.length
    });

    try {
        for (const roomType of roomTypes) {
            await Hotel.updateOne(
                { _id: hotelId, "room_types.code": roomType.code },
                { $inc: { "room_types.$.available_rooms": -1 } }
            );
        }
        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (err) {
        console.error("Error making reservation:", err);
        res.status(500).json({ message: "Failed to make reservation", error: err.message });
    }
}

module.exports = {
    makeReservation,
    searchHotels,

};
