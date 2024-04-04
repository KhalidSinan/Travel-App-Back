const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(payload, secret = SECRET_KEY) {
    return jwt.sign(payload, secret);
}

function verifyToken(token, secret) {
    return jwt.verify(token, secret)
}

module.exports = {
    generateToken,
    verifyToken
}