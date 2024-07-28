function top10HotelsData(hotel) {
    const location = hotel.location.name + ', ' + hotel.location.city + ', ' + hotel.location.country
    return {
        id: hotel._id,
        name: hotel.name,
        location: location,
        reservationCount: hotel.reservationCount,
        stars: hotel.stars,
        images: hotel.images[0]
    }
}

module.exports = {
    top10HotelsData
}