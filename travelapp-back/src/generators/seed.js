const { mongoConnect, mongoDisconnect } = require('../services/mongo');
const createTrips = require('./Trips/trips.generation');

async function seedDB() {
    await mongoConnect();
    const count = 30000;

    // Trips
    await createTrips(count);

    console.log('Database seeded!');
    await mongoDisconnect()
}

seedDB().catch(err => console.error(err));