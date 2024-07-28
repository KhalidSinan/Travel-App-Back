const { getHotelReservationCount } = require("../../../models/hotel-reservation.model");
const { getHotelById, getAllHotels, getAllHotelsCount } = require("../../../models/hotels.model");
const { getPagination } = require('../../../services/query')
const { serializedData } = require('../../../services/serializeArray');
const { getHotelsHelper } = require("./hotels.helper");
const { hotelData, hotelDetails } = require("./hotels.serializer");

async function httpGetHotels(req, res) {
    req.query.limit = 10
    const { skip, limit } = getPagination(req.query);
    const filter = { name: RegExp(req.query.search, 'i') ?? null }
    let hotels = await getAllHotels(skip, limit, filter)
    const hotelsCount = await getAllHotelsCount(filter)

    hotels = await getHotelsHelper(hotels)
    let data = []
    if (hotelsCount != 0) data = serializedData(hotels, hotelData)

    return res.status(200).json({
        message: 'Hotels Found',
        count: hotelsCount,
        data: data
    })
}

async function httpGetHotelData(req, res) {
    const hotel = await getHotelById(req.params.id)
    if (!hotel) return res.status(400).json({ message: 'Hotel Not Found' })
    hotel.reservationCount = await getHotelReservationCount(req.params.id)
    return res.status(200).json({
        message: 'Hotel Found',
        data: hotelDetails(hotel)
    })
}

module.exports = {
    httpGetHotels,
    httpGetHotelData
};
