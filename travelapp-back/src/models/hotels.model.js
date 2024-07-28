const Hotel = require("./hotels.mongo")


async function getHotelById(id) {
    return await Hotel.findById(id).select('-_id -__v -room_types._id')
}

async function findHotelsInCountry(countryName) {
    const hotels = await Hotel.find({ "location.country": countryName });
    return hotels.map(hotel => hotel.id);

}

async function findHotelsByPrice(price) {
    const hotels = await Hotel.find({ 'room_types.price': price });
    return hotels.map(hotel => hotel.id);
}

async function getHotels(options) {
    const {
        skip = 0,
        limit = 10,
        sortField = '',
        order = 'abc'
    } = options;

    const sortOrder = order === 'abc' ? 1 : -1;
    let sortOptions = {};


    if (sortField === 'price') {
        sortOptions = { 'room_types.price': sortOrder };
    } else if (sortField === 'stars') {
        sortOptions = { 'stars': sortOrder };
    }


    const query = Hotel.find();
    if (Object.keys(sortOptions).length > 0) {
        query.sort(sortOptions);
    }
    const hotels = await query.skip(skip).limit(limit);

    return hotels.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        price: sortField === 'price' ? hotel.room_types.map(rt => rt.price) : undefined,
        stars: sortField === 'stars' ? hotel.stars : undefined
    }));
}

async function getAllHotels(skip, limit, filter) {
    return await Hotel.find(filter).skip(skip).limit(limit)
}

async function getAllHotelsCount(filter) {
    return await Hotel.find(filter).countDocuments()
}

module.exports = {
    getHotels,
    getHotelById,
    findHotelsInCountry,
    findHotelsByPrice,
    getAllHotels,
    getAllHotelsCount
}