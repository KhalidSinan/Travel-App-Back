const { getHotelReservationCount } = require("../../../models/hotel-reservation.model")

async function getHotelsHelper(hotels) {
    await Promise.all(hotels.map(async hotel => {
        let temp = hotel
        temp.reservationCount = await getHotelReservationCount(hotel._id)
    }))
    return hotels
}

module.exports = {
    getHotelsHelper
}