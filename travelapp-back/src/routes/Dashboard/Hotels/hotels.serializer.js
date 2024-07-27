function hotelData(hotel) {
    let minRoomPrice = 10000
    hotel.room_types.forEach(room => {
        minRoomPrice = Math.min(room.price, minRoomPrice)
    })
    return {
        _id: hotel._id,
        name: hotel.name,
        location: hotel.location,
        stars: hotel.stars,
        description: hotel.description,
        room_types: hotel.room_types,
        rooms_number: hotel.rooms_number,
        distance_from_city_center: hotel.distance_from_city_center,
        images: hotel.images,
        starts_from: hotel.starts_from ?? minRoomPrice,
    }
}

module.exports = {
    hotelData
}