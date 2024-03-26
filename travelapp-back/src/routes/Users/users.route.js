const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../middlewares/checkJwtAuth');
const checkObjectID = require('../../middlewares/checkObjectID');

const upload = require('../../services/imageUploading');
const { httpPutName, httpPutGender, httpPutDate, httpPutProfilePic, httpGetProfile } = require('./users.controller');

const userRouter = express.Router()

userRouter.put('/name', requireJwtAuth, asyncHandler(httpPutName))
userRouter.put('/gender', requireJwtAuth, asyncHandler(httpPutGender))
userRouter.put('/date', requireJwtAuth, asyncHandler(httpPutDate))
userRouter.put('/profile-pic', requireJwtAuth, upload.single('profile_pic'), asyncHandler(httpPutProfilePic))
userRouter.get('/profile', requireJwtAuth, asyncHandler(httpGetProfile))

module.exports = userRouter