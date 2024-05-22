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

var path = require('path');

// Images
app.use(express.static(path.resolve('./public')));
app.use('/public', express.static(path.resolve('./public')));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(logger); // Logging Requests To Access Log

// Security
app.use(helmet())
app.use(cors());

// Mobile
app.use('/auth', require('./routes/Mobile/Auth/auth.route'))
app.use('/flights', require('./routes/Mobile/Flights/flights.route'))
app.use('/plane-reservations', require('./routes/Mobile/PlaneReservations/plane-reservations.route'))
app.use('/users', require('./routes/Mobile/Users/users.route'))
app.use('/payment', require('./routes/Mobile/Payments/payments.route'))
app.use('/notifications', require('./routes/Mobile/Notifications/notifications.route'))
app.use('/hotels', require("./routes/Mobile/Hotels/hotels.route"))

// Dashboard
app.use('/dashboard', require('./routes/Dashboard/Admins/admins.route'))
app.use('/dashboard', require('./routes/Dashboard/Announcements/announcements.route'))
app.use('/dashboard', require('./routes/Dashboard/Organizers/organizers.route'))

// Error Handling
app.use(errorHandler);

module.exports = app;