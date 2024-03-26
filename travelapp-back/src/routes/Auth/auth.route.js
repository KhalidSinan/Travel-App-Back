const express = require('express');
const asyncHandler = require('express-async-handler');
const { register, login, forgotPassword, resetPassword } = require('./auth.controller');

const authRouter = express.Router();

authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));
authRouter.post('/forgot-password', asyncHandler(forgotPassword));
authRouter.post('/reset-password/:id/:token', asyncHandler(resetPassword));


module.exports = authRouter;