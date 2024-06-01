
const Place = require('../../../models/places.mongo');
const { getAllByCityValidation, getAllNearbyValidation } = require('./places.validation');

async function getAllByCity(req, res) {
    const { error } = getAllByCityValidation.validate(req.query);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { city, category } = req.query;
    let query = {};

    if (!category) {
        return res.status(400).json({ message: 'Category parameter is required' });
    }
    query.category = category;

    if (city) {
        query['address.city'] = city;
    }

    try {
        const places = await Place.find(query);
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving places', error });
    }
}

async function getAllNearby(req, res) {
    const { error } = getAllNearbyValidation.validate(req.query);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { category } = req.query;
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.location || !user.location.city) {
            return res.status(400).json({ message: 'User location city is not set' });
        }

        let query = { 'address.city': user.location.city };

        if (category) {
            query.category = category;
        }

        const places = await Place.find(query);
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving nearby places', error });
    }
}

module.exports = {
    getAllByCity,
    getAllNearby,
};
