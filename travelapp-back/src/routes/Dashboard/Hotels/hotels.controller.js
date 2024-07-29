const { getHotelReservationCount } = require("../../../models/hotel-reservation.model");
const { getHotelById, getAllHotels, getAllHotelsCount } = require("../../../models/hotels.model");
const { getPagination } = require('../../../services/query')
const { serializedData } = require('../../../services/serializeArray');
const { getHotelsHelper, getHotelsHelperSort } = require("./hotels.helper");
const { hotelData, hotelDetails } = require("./hotels.serializer");

async function httpGetHotels(req, res) {
    req.query.limit = 10
    const { skip, limit } = getPagination(req.query);
    const filter = {};
    if (req.query.stars) {
        filter.stars = req.query.stars;
    }
    if (req.query.search) {
        filter.name = RegExp(req.query.search, 'i');
    }
    let hotels = await getAllHotels(filter, req.query.sort, req.query.sortBy)
    const hotelsCount = await getAllHotelsCount(filter)
    hotels = await getHotelsHelper(hotels)
    hotels = getHotelsHelperSort(hotels, req.query.sort, req.query.sortBy)
    hotels = hotels.slice(skip, skip + limit)
    return res.status(200).json({
        message: 'Hotels Found',
        count: hotelsCount,
        data: serializedData(hotels, hotelData)
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
