const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const errorHandler = require('./middlewares/errorHandler')
const logger = require('./services/logger');
const app = express();

// FCM 
var admin = require("firebase-admin");

var serviceAccount = require('./config/push-notification-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Cron Jobs
const cron = require('./services/cron')

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(logger); // Logging Requests To Access Log

// Security
app.use(helmet())
app.use(cors());

// Use Routes
app.use('/auth', require('./routes/Auth/auth.route'))
app.use('/flights', require('./routes/Flights/flights.route'))
app.use('/plane-reservations', require('./routes/PlaneReservations/plane-reservations.route'))
app.use('/users', require('./routes/Users/users.route'))
app.use('/payment', require('./routes/Payments/payments.route'))

// Error Handling
app.use(errorHandler);

module.exports = app;