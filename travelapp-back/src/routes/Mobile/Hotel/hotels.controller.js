
const { validationErrors } = require('../../../middlewares/validationErrors');
const { searchHotelsValidation, reservationValidation } = require('./hotels.validation');
const { postReservation } = require("../../../models/hotel-reservations.model");
const { getPagination } = require('../../../services/query');
const { getAllHotel, getHotelById, findHotelsInCountry } = require("../../../models/hotels.model")
const { getUserById } = require("../../../models/users.model")
const HotelReservation = require('../../../models/hotel-reservations.mongo');
const Hotel = require('../../../models/hotels.mongo');
const { calculateTotalPrice } = require('./hotels.helper');

// async function Reserve(req, res) {
//     const { error } = validateReserveHotel(req.body);
//     if (error) {
//         return res.status(400).json({ message: validationErrors(error.details[0].message) });
//     }

//     const hotel = await getHotelById(req.body.hotel_id);
//     if (!hotel) {
//         return res.status(404).json({ message: "Hotel not found" });
//     }

//     const user = await getUserById(req.body.id);
//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }

//     const room = hotel.room_types.find(r => r._id.toString() === room_Id && r.available_rooms > 0);
//     if (!room) {
//         return res.status(400).json({ message: "Room type not available or is full" });
//     }

//     try {
//         const roomIndex = hotel.room_types.findIndex(r => r._id.toString() === room_Id);
//         if (roomIndex === -1 || hotel.room_types[roomIndex].available_rooms < req.body.room_number) {
//             return res.status(400).json({ message: "Not enough rooms available" });
//         }

//         hotel.room_types[roomIndex].available_rooms -= req.body.room_number;

//         const reservation = await postReservation({
//             hotel_id: hotel._id,
//             user_id: user._id,
//             room_Id: req.body.room_Id,
//             room_number: req.body.room_number,
//             room_price: req.body.room_price
//         });

//         await hotel.save();

//         res.status(201).json(reservation);
//     } catch (error) {
//         console.error("Error saving hotel:", error);
//         res.status(500).json({ message: "Failed to create reservation", error: error.message });
//     }
// }


// module.exports = { Reserve };

async function searchHotels(req, res) {
    const { nameOrCity, startDate, numDays, numRooms } = req.body;
    if (!nameOrCity) {
        return res.status(400).json({ error: "You must provide either the hotel name or the city name." });
    }

    // Date if not given then today is the date
    let effectiveStartDate;
    if (startDate) {
        const [day, month, year] = startDate.split('/').map(Number);
        effectiveStartDate = new Date(year, month - 1, day);
    } else {
        effectiveStartDate = new Date();
    }
    effectiveStartDate.setHours(0, 0, 0, 0);

    console.log("Effective Start Date:", effectiveStartDate);

    let query = {
        $or: [
            { name: { $regex: new RegExp(nameOrCity, 'i') } },
            { 'location.city': { $regex: new RegExp(nameOrCity, 'i') } }
        ]
    };

    const hotels = await Hotel.find(query);

    console.log("Hotels found:", hotels.length);

    if (!startDate && !numDays && !numRooms) {
        return res.json(hotels);
    } else if (numRooms && !numDays) {
        const suitableHotels = hotels.filter(hotel => {
            return hotel.room_types.some(roomType => roomType.available_rooms >= numRooms);
        });
        console.log("Suitable Hotels for numRooms:", suitableHotels.length);
        return res.json(suitableHotels);
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
        console.log("Available Hotels for numDays:", availableHotels.filter(Boolean).length);
        return res.json(availableHotels.filter(Boolean));
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
        console.log("Available Hotels for startDate, numDays, and numRooms:", availableHotels.filter(Boolean).length);
        return res.json(availableHotels.filter(Boolean));
    }
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
    searchHotels
};
