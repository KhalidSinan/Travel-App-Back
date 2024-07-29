const { getHotelReservationCount } = require("../../../models/hotel-reservation.model")

async function getHotelsHelper(hotels) {
    await Promise.all(hotels.map(async hotel => {
        let temp = hotel
        temp.reservationCount = await getHotelReservationCount(hotel._id)
        if (temp.reservationCount > 0) console.log('ss')
    }))
    return hotels
}

function getHotelsHelperSort(hotels, sort, sortBy) {
    if (sortBy == 'reservationCount') {
        if (sort && (sort == 'asc' || sort == 'desc')) {
            if (sort == 'asc') hotels = hotels.sort((a, b) => a.reservationCount - b.reservationCount);
            if (sort == 'desc') hotels = hotels.sort((a, b) => b.reservationCount - a.reservationCount);
        }
    }
    return hotels
}

module.exports = {
    getHotelsHelper,
    getHotelsHelperSort
}