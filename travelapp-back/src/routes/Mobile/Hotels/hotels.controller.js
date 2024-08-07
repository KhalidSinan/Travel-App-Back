
const { validationErrors } = require('../../../middlewares/validationErrors');
const { searchHotelsValidation, reservationValidation, searchHotelsByCityValidation } = require('./hotels.validation');
const { postReservation, getMyHotelReservations, getHotelReservation } = require("../../../models/hotel-reservation.model");
const { getPagination } = require('../../../services/query');
const { getAllHotel, getHotelById, findHotelsInCountry } = require("../../../models/hotels.model")
const { getUserById } = require("../../../models/users.model")
const HotelReservation = require('../../../models/hotel-reservation.mongo');
const Hotel = require('../../../models/hotels.mongo');
const { calculateTotalPrice, hotelDataPriceSortHelper, findConflicts, getPriceForRooms, getHotelReservationHelper } = require('./hotel.helper');
const { serializedData } = require('../../../services/serializeArray')
const { hotelData, hotelReservationData, hotelReservationDetailsData } = require('./hotels.serializer')
const createPaymentData = require('../../../services/payment');
const { paymentSheet } = require('../Payments/payments.controller');
const { getCities } = require('../../../services/locations')

async function searchHotels(req, res) {
    let { nameOrCity, startDate, numDays, numRooms, stars, sortField = 'nothing', order = 'asc', page = 1 } = req.body;
    const { error } = searchHotelsValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    if (!nameOrCity) {
        return res.status(400).json({ error: "You must provide either the hotel name or the city name." });
    }

    let effectiveStartDate;
    if (startDate != '') {
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
    if (stars >= 1) {
        query.stars = stars;
    }
    const { skip, limit } = getPagination({ page, limit: 10 });
    let sortOptions = {};
    if (sortField === 'stars') {
        sortOptions = { 'stars': order === 'asc' ? 1 : -1 };
    }
    const hotelsCount = await Hotel.find(query).countDocuments();
    const hotelsQuery = Hotel.find(query);

    if (Object.keys(sortOptions).length > 0) {
        hotelsQuery.sort(sortOptions);
    }

    let hotels = await hotelsQuery;
    if (sortField === 'price') {
        hotels = hotelDataPriceSortHelper(hotels, order)
    }
    console.log("Hotels found:", hotelsCount);

    const current_page = Math.min(10, 10 - ((page * 10) - hotelsCount));
    let response = {
        totalHotelsFound: hotelsCount,
        current_page: current_page,
        hotels: []
    };

    // if (numDays == 0) numDays = null
    // if (numRooms == 0) numRooms = null

    if (startDate == '' && numDays == 1 && numRooms == 1) {
        response.hotels = hotels;
        response.hotels = response.hotels.slice(skip, skip + 10)
        console.log('All Hotels')
    } else if (numRooms && numDays == 1) {
        const suitableHotels = hotels.filter(hotel => {
            return hotel.room_types.some(roomType => roomType.available_rooms >= numRooms);
        });
        console.log("Suitable Hotels for numRooms:", suitableHotels.length);
        response.totalHotelsFound = suitableHotels.length;
        response.hotels = suitableHotels;
        response.hotels = response.hotels.slice(skip, skip + 10)
    } else if (numDays && numRooms == 1) {
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
        response.hotels = response.hotels.slice(skip, skip + 10)
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
        response.hotels = response.hotels.slice(skip, skip + 10)
    }
    response.current_page = Math.max(Math.min(10, 10 - ((page * 10) - response.totalHotelsFound)), 0);

    response.hotels = serializedData(response.hotels, hotelData)
    return res.json({ data: response });
}

async function makeReservation(req, res) {
    const { error } = reservationValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { hotelId, roomCodes, startDate, numDays } = req.body;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + numDays);

    const userId = req.user.id;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const roomCodeKeys = roomCodes.map(room => room.code)
    const roomTypes = roomCodeKeys.map(code => hotel.room_types.find(room => room.code === code));

    if (roomTypes.some(roomType => !roomType)) {
        return res.status(404).json({ message: "One or more rooms are not available" });
    }

    const conflicts = await findConflicts(hotel, startDate, endDate, roomCodes);

    if (conflicts.length > 0) {
        let problems = []
        conflicts.forEach(conflict => {
            let temp = {
                code: conflict.code,
                available: conflict.available,
                message: `Room Code ${conflict.code} Has Only ${conflict.available} Room(s) Available, Cant Book ${conflict.count}`
            }
            problems.push(temp)
        })
        return res.status(400).json({
            message: "Rooms Cant Be Booked",
            problems: problems,
        });
    }

    const room_data = getPriceForRooms(hotel, roomCodes)
    const calculatedTotalPrice = calculateTotalPrice(room_data, startDate, endDate);

    const number_of_rooms = roomCodes.reduce((acc, room) => {
        return acc + room.count
    }, 0)

    const newReservation = new HotelReservation({
        hotel_id: hotelId,
        user_id: userId,
        room_codes: room_data,
        start_date: startDate,
        end_date: endDate,
        room_price: calculatedTotalPrice,
        number_of_rooms: number_of_rooms
    });

    try {
        for (const roomType of roomCodes) {
            await Hotel.updateOne(
                { _id: hotelId, "room_types.code": roomType.code },
                { $inc: { "room_types.$.available_rooms": -roomType.count } }
            );
        }
        await newReservation.save();
        return res.status(201).json(newReservation);
    } catch (err) {
        console.error("Error making reservation:", err);
        return res.status(500).json({ message: "Failed to make reservation", error: err.message });
    }
}

async function payReservation(req, res) {
    const reservation = await HotelReservation.findById(req.params.id)
    if (!reservation) return res.status(400).json({ message: 'Reservation Not Found' })
    const payment_data = createPaymentData(reservation.room_codes, reservation.room_price, "hotel")
    req.body.data = payment_data
    paymentSheet(req, res)
}

async function getCountriesWithCities(req, res) {
    const cities = getCities();
    return res.status(200).json({ message: 'Data Retreived Successfully', cities })
}

async function getHotelsByCities(req, res) {
    let { city, startDate, numDays, numRooms, page = 1 } = req.body;
    const { error } = searchHotelsByCityValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    if (!city) {
        return res.status(400).json({ error: "You must provide the city name." });
    }

    const [day, month, year] = startDate.split('/').map(Number);
    let effectiveStartDate = new Date(year, month - 1, day);
    effectiveStartDate.setHours(3, 0, 0, 0);

    let query = {
        'location.city': city,
    }

    const { skip, limit } = getPagination({ page, limit: 10 });

    const hotelsCount = await Hotel.find(query).countDocuments();
    const hotelsQuery = Hotel.find(query);

    let hotels = await hotelsQuery;
    let current_page = Math.min(10, 10 - ((page * 10) - hotelsCount));
    let response = {
        totalHotelsFound: hotelsCount,
        current_page: current_page,
        hotels: []
    };

    console.log("Hotels found:", hotelsCount);

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
    response.hotels = response.hotels.slice(skip, skip + 10)
    response.hotels = serializedData(response.hotels, hotelData)

    response.current_page = Math.max(Math.min(10, 10 - ((page * 10) - filteredHotels.length)), 0);
    return res.json({ data: response });
}

async function httpGetHotelReservations(req, res) {
    const reservations = await getMyHotelReservations(req.user._id)
    return res.status(200).json({ data: serializedData(reservations, hotelReservationData) });
}

async function httpGetHotelReservation(req, res) {
    let reservation = await getHotelReservation(req.params.id)
    if (!reservation) return res.status(400).json({ message: 'Reservation Not Found' });
    reservation.rooms = getHotelReservationHelper(reservation)
    return res.status(200).json({ data: hotelReservationDetailsData(reservation) });
}

module.exports = {
    makeReservation,
    searchHotels,
    payReservation,
    getCountriesWithCities,
    getHotelsByCities,
    httpGetHotelReservations,
    httpGetHotelReservation
};
