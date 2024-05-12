const { mongoConnect, mongoDisconnect, dropDatabase } = require('../services/mongo');
const createHotels = require('./Hotel/hotels.generation');
const createPlaces = require('./Places/places.generation');
const createTrips = require('./Trips/trips.generation');

async function seedDB() {
    await mongoConnect();
    const count = 30000;

    // Delete All Tables
    console.log('Dropping Database')
    await dropDatabase()

    console.log('Seeding Database');

    // Admin
    // await createAdmin();

    // Trips
    await createTrips(count);
    // Hotels
    await createHotels()
    // Places
    await createPlaces()

    console.log('Database seeded!');

    await mongoDisconnect()
}

seedDB().catch(err => console.log(err));
