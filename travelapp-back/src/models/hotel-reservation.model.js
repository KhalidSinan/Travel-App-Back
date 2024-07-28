const HotelReservation = require("./hotel-reservation.mongo")
const Hotel = require("./hotels.mongo")

async function postReservation(data) {
    const newReservation = new HotelReservation(data);
    return await newReservation.save();
}

async function getHotelReservation(id) {
    return await HotelReservation.findById(id);
}

async function getHotelReservationsWithDetails(ids) {
    return await HotelReservation.find({ _id: ids }).populate('hotel_id', '-location._id');
}

async function getTop10Hotels() {
    const topHotels = await HotelReservation.aggregate([
        {
            $group: {
                _id: '$hotel_id',
                reservationCount: { $sum: 1 }
            }
        },
        { $sort: { reservationCount: -1 } },
        { $limit: 10 }
    ]);
    return await Hotel.populate(topHotels, {
        path: '_id',
        select: 'name',
    });
}

async function getHotelReservationCount(hotel_id) {
    return await HotelReservation.find({ hotel_id }).countDocuments()
}

module.exports = {
    postReservation,
    getHotelReservation,
    getHotelReservationsWithDetails,
    getTop10Hotels,
    getHotelReservationCount
}

