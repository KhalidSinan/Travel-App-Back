const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

async function mongoConnect() {
    await mongoose.connect(MONGO_URL)
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

async function dropDatabase() {
    const collections = mongoose.connection.collections;

    await Promise.all(Object.values(collections).map((collection) =>
        collection.deleteMany({}) // an empty mongodb selector object ({}) must be passed as the filter argument
    ));
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
    dropDatabase
}