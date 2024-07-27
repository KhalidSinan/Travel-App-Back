const { getHotelById } = require("../../../models/hotels.model");

// make serializer
async function httpGetHotelData(req, res) {
    const hotel = await getHotelById(req.params.id)
    if (!hotel) return res.status(400).json({ message: 'Hotel Not Found' })
    return res.status(200).json({
        message: 'Hotel Found',
        data: hotel
    })
}

module.exports = {
    httpGetHotelData
};
