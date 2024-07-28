const { getHotelById, getHotels } = require("../../../models/hotels.model");

// make serializer
async function httpGetHotels(req, res) {
    const hotels = await getHotelById(req.params.id)
    return res.status(200).json({
        message: 'Hotel Found',
        data: hotel
    })
}

async function httpGetHotelData(req, res) {
    const hotel = await getHotels()
    if (!hotel) return res.status(400).json({ message: 'Hotel Not Found' })
    return res.status(200).json({
        message: 'Hotel Found',
        data: hotel
    })
}

module.exports = {
    httpGetHotelData
};
