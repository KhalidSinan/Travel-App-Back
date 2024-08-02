const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(payload, secret = SECRET_KEY) {
    return jwt.sign(payload, secret);
}

function verifyToken(token, secret) {
    try {
        const data = jwt.verify(token, secret)
        return data
    } catch (e) {
        return null;
    }
}

module.exports = {
    generateToken,
    verifyToken
}