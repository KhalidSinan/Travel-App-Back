function calculateTotalPrice(roomTypes, roomCodes, startDate, endDate) {
    const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    let totalPrice = 0;
    roomCodes.forEach(code => {
        const roomType = roomTypes.find(room => room.code === code);
        if (roomType) {
            totalPrice += roomType.price * days;
        }
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

module.exports = {
    calculateTotalPrice,
    hotelDataPriceSortHelper
}