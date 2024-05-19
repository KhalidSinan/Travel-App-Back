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

module.exports = {
    calculateTotalPrice
}