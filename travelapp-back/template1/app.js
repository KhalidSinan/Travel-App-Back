const cors = require('cors');
const helmet = require('helmet');
const express = require('express');

const errorHandler = require('./middlewares/errorHandler')
const logger = require('./services/logger');
const app = express();

app.use(express.json());
app.use(logger);

app.use(helmet())
app.use(cors());

// Use Routes

// Error Handling
app.use(errorHandler);


module.exports = app;