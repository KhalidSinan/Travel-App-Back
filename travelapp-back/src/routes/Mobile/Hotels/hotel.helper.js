const HotelReservation = require('../../../models/hotel-reservations.mongo');

function calculateTotalPrice(room_data, startDate, endDate) {
    const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    let totalPrice = 0;
    room_data.forEach(room => {
        let temp = room.price * days * room.count;
        totalPrice += temp;
        room.overall_price = temp
        room.overall_price = room.overall_price.toFixed(2)
    });
    return totalPrice;
}

function hotelDataPriceSortHelper(hotels, order) {
    const orderBy = order === 'asc' ? 1 : -1;
    hotels.forEach(hotel => {
        const minPrice = hotelDataGetMinPrice(hotel)
        hotel.starts_from = minPrice
    })
    if (orderBy == 1) {
        hotels.sort((a, b) => a.starts_from - b.starts_from)
    } else {
        hotels.sort((a, b) => b.starts_from - a.starts_from)
    }
    return hotels
}

function hotelDataGetMinPrice(hotel) {
    let minRoomPrice = 10000
    hotel.room_types.forEach(room => {
        minRoomPrice = Math.min(room.price, minRoomPrice)
    })
    return minRoomPrice
}

async function findConflicts(hotel, startDate, endDate, room_codes) {
    let data = [];
    await Promise.all(room_codes.map(async (room) => {
        let roomsReservedInThisDate = await HotelReservation.find({
            hotel_id: hotel._id,
            'room_codes.code': room.code,
            $or: [
                { start_date: { $lte: endDate }, end_date: { $gte: startDate } },
            ]
        });
        let totalRoomsReserved = 0
        roomsReservedInThisDate.forEach(reservation => {
            totalRoomsReserved += reservation.room_codes.find(tempRoom => tempRoom.code == room.code).count
        })
        const tempRoomTotal = hotel.room_types.find(hotelRoom => hotelRoom.code == room.code).total_rooms
        room.available = tempRoomTotal - totalRoomsReserved
        if (tempRoomTotal - totalRoomsReserved - room.count < 0) {
            data.push(room)
        }
    }));
    return data;

}

function getPriceForRooms(hotel, room_codes) {
    let data = []
    const rooms = hotel.room_types
    room_codes.forEach(room => {
        const newRoom = rooms.find(tempRoom => tempRoom.code == room.code)
        let temp = {
            code: room.code,
            count: room.count,
            price: newRoom.price,
        }
        data.push(temp)
    })
    return data;
}

module.exports = {
    calculateTotalPrice,
    hotelDataPriceSortHelper,
    findConflicts,
    getPriceForRooms
}