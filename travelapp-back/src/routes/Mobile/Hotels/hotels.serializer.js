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
    const num_of_days = (reservation.end_date - reservation.start_date) / 1000 / 60 / 60 / 24
    return {
        id: reservation._id,
        name: reservation.hotel_id.name,
        num_of_rooms: reservation.room_codes.length,
        num_of_days: num_of_days,
        reservation_date: reservation.start_date,
        overall_price: reservation.room_price,
    }
}

function hotelReservationDetailsData(reservation) {
    console.log(reservation.rooms)
    const num_of_days = (reservation.end_date - reservation.start_date) / 1000 / 60 / 60 / 24
    return {
        num_of_rooms: reservation.room_codes.length,
        num_of_days: num_of_days,
        reservation_date: reservation.start_date,
        overall_price: reservation.room_price,
        rooms: reservation.rooms
    }
}

module.exports = {
    hotelData,
    hotelReservationData,
    hotelReservationDetailsData
}