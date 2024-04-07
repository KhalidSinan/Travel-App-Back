const express = require('express');
const asyncHandler = require('express-async-handler');
const { register, login, forgotPassword, resetPassword, confirmEmail, logout, continueWithGoogle } = require('./auth.controller');

const requireJwtAuth = require('../../middlewares/checkJwtAuth');

const authRouter = express.Router();

authRouter.post('/register', asyncHandler(register));
authRouter.post('/confirm-email', asyncHandler(confirmEmail));
authRouter.post('/login', asyncHandler(login));
authRouter.post('/forgot-password', asyncHandler(forgotPassword));
authRouter.post('/reset-password', asyncHandler(resetPassword));
authRouter.post('/logout', requireJwtAuth, asyncHandler(logout));
authRouter.post('/google-signin', asyncHandler(continueWithGoogle));


module.exports = authRouter;