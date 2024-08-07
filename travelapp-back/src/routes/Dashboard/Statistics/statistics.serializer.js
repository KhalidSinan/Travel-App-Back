function top10HotelsData(hotel) {
    const location = hotel._id.location.name + ', ' + hotel._id.location.city + ', ' + hotel._id.location.country
    return {
        id: hotel._id._id,
        name: hotel._id.name,
        location: location,
        reservationCount: hotel.reservationCount,
        stars: hotel.stars,
        images: hotel._id.images[0]
    }
}

function airlineData(airline) {
    return {
        airline: airline.airline,
        count: airline.count,
        logo: airline.logo
    }
}

module.exports = {
    top10HotelsData,
    airlineData
}