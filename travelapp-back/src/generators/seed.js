const { mongoConnect, mongoDisconnect, dropDatabase } = require('../services/mongo');
const createPlaces = require('./Places/places.generation');
const createTrips = require('./Trips/trips.generation');

async function seedDB() {
    await mongoConnect();
    const count = 10000;

    // Delete All Tables
    console.log('Dropping Database')
    await dropDatabase()

    console.log('Seeding Database');

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
