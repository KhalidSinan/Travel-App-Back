const { mongoConnect, mongoDisconnect } = require('../services/mongo');
const createTrips = require('./Trips/trips.generation');

async function seedDB() {
    await mongoConnect();
    const count = 10000;
    const existingData = 1;
    createTrips(count);

    if (existingData === 0) {
        // seed trip
        console.log('Database seeded!');
    } else {
        console.log('Seeding not required.');
    }
}

seedDB().catch(err => console.error(err));