// Get all by city
// Get all by country
// Get all nearby
const Place = require('./places.mongo')

async function getPlaceByCity(city, size) {
    return await Place.aggregate([
        { $match: { 'address.city': city } },
        { $sample: { size: size } }
    ]);
}

module.exports = {
    getPlaceByCity
}