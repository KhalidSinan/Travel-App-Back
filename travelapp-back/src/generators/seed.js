const adminsMongo = require('../models/admins.mongo');
const { mongoConnect, mongoDisconnect, dropDatabase } = require('../services/mongo');
const { createAdmins } = require('./admins.generation');
const createHotels = require('./hotels.generation');
const createPlaces = require('./places.generation');
const createTrips = require('./trips.generation');

async function seedDB() {
    await mongoConnect();
    const count = 20000;

    // Delete All Tables
    console.log('Dropping Database')
    await dropDatabase()

    console.log('Seeding Database');

    // Admin
    console.log('Seeding Admins');
    await createAdmins();
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
