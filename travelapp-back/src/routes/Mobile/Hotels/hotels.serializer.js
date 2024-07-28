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

function hotelReservationData(reservation) {
    const location = reservation.hotel_id.location.name + ', ' + reservation.hotel_id.location.city + ', ' + reservation.hotel_id.location.country
    return {
        id: reservation._id,
        name: reservation.hotel_id.name,
        location: location,
        stars: reservation.hotel_id.stars,
        overall_price: reservation.room_price,
        image: reservation.hotel_id.images[0]
    }
}

function hotelReservationDetailsData(reservation) {
    const location = reservation.hotel_id.location.name + ', ' + reservation.hotel_id.location.city + ', ' + reservation.hotel_id.location.country
    return {
        id: reservation._id,
        name: reservation.hotel_id.name,
        location: location,
        stars: reservation.hotel_id.stars,
        overall_price: reservation.room_price,
        start_date: reservation.start_date,
        end_date: reservation.end_date,
        rooms: reservation.room_codes
    }
}

module.exports = {
    hotelData,
    hotelReservationData,
    hotelReservationDetailsData
}