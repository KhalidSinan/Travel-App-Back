function hotelData(hotel) {
    const location = hotel.location.name + ', ' + hotel.location.city + ', ' + hotel.location.country
    return {
        id: hotel._id,
        name: hotel.name,
        location: location,
        reservationCount: hotel.reservationCount
    }
}

function hotelDetails(hotel) {
    const location = hotel.location.name + ', ' + hotel.location.city + ', ' + hotel.location.country
    return {
        name: hotel.name,
        location: location,
        stars: hotel.stars,
        description: hotel.description,
        room_types: hotel.room_types,
        rooms_number: hotel.rooms_number,
        distance_from_city_center: hotel.distance_from_city_center,
        images: hotel.images,
        reservationCount: hotel.reservationCount
    }
}

module.exports = {
    hotelData,
    hotelDetails
}