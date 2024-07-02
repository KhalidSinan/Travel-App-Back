const adminsMongo = require('../models/admins.mongo');
const { mongoConnect, mongoDisconnect, dropDatabase } = require('../services/mongo');
const createHotels = require('./Hotel/hotels.generation');
const createPlaces = require('./Places/places.generation');
const createTrips = require('./Trips/trips.generation');

async function seedDB() {
    await mongoConnect();
    const count = 20000;

    // Delete All Tables
    console.log('Dropping Database')
    await dropDatabase()

    console.log('Seeding Database');

    // Admin
    // await createAdmin();
    await adminsMongo.create({ username: 'elonMusk-22', password: '123123123', role: 'Super-Admin' })

    // Trips
    console.log('Seeding Trips')
    await createTrips(count);
    // Hotels
    console.log('Seeding Hotels')
    await createHotels()
    // Places
    console.log('Seeding Places')
    await createPlaces()

    console.log('Database seeded!');

    await mongoDisconnect()
}

seedDB().catch(err => console.log(err));
