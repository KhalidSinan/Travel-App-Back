const { getHotelById } = require("../../../models/hotels.model");

// make serializer
async function httpGetFlights(req, res) {
    const hotel = await getHotelById(req.params.id)
    return res.status(200).json({
        message: 'Flights Found',
        count: 4,
        data: hotel
    })
}

async function httpGetFlight(req, res) {
    const flight = await getHotelById(req.params.id)
    if (!flight) return res.status(400).json({ message: 'Flight Not Found' })

    return res.status(200).json({
        message: 'Flight Found',
        data: flight
    })
}

module.exports = {
    httpGetHotelData
};
