const { mongo } = require('mongoose');
const adminsMongo = require('../models/admins.mongo');
const { mongoConnect, mongoDisconnect, dropDatabase } = require('../services/mongo');
const { createAdmins } = require('./admins.generation');
const { createUsers, createAnnouncementsApp, createReportsApp, createOneWayFlightReservations, createTrips, createOrganizedTrips, createReportsOrganizers, createAnnouncementsRequests, createAnnouncementsOrganizer, createOrganizersRequests, createOrganizedTripReservations } = require('./extraSeeding.generation');
const createHotels = require('./hotels.generation');
const createPlaces = require('./places.generation');
const createFlights = require('./trips.generation');

async function seedDB() {
    await mongoConnect();
    const count = 15000;

    // Delete All Tables
    console.log('Dropping Database')
    await dropDatabase()

    console.log('Seeding Database');

    // Admin
    console.log('Seeding Admins');
    await createAdmins();
    // Trips
    console.log('Seeding Flights')
    await createFlights(count);
    // Hotels
    console.log('Seeding Hotels')
    await createHotels()
    // Places
    console.log('Seeding Places')
    await createPlaces()

    await extraSeeding()
    console.log('Database seeded!');


    await mongoDisconnect()
}

async function extraSeeding() {
    console.log('Seeding Users')
    await createUsers()
    console.log('Seeding Announcements For App')
    await createAnnouncementsApp()
    console.log('Seeding Reports On App')
    await createReportsApp()
    console.log('Seeding Trips')
    await createTrips()
    console.log('Seeding Organized Trips')
    await createOrganizedTrips()
    console.log('Seeding Reports On Organizers')
    await createReportsOrganizers()
    console.log('Seeding Announcements For Request')
    await createAnnouncementsRequests()
    console.log('Seeding Announcements For Organizers')
    await createAnnouncementsOrganizer()
    console.log('Seeding Organizers Requests')
    await createOrganizersRequests()
    console.log('Seeding Organized Reservations')
    await createOrganizedTripReservations()
}

seedDB().catch(err => console.log(err));
