const schedule = require('node-schedule')
const mongoose = require('mongoose')
const createTrips = require('../generators/Trips/trips.generation')

// Just Remove Comment

// Task 1 : Add Trips To DB Daily 5K each day

// const AddTrips = schedule.scheduleJob('* * * * * *', async function () {
//     createTrips(1)
// })
