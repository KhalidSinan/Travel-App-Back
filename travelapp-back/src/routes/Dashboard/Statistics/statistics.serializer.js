function top10HotelsData(hotel) {
    return {
        id: hotel._id._id,
        name: hotel._id.name,
        reservationCount: hotel.reservationCount
    }
}

module.exports = {
    top10HotelsData
}