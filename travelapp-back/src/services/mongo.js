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
    await mongoose.connection.db.dropDatabase();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
    dropDatabase
}