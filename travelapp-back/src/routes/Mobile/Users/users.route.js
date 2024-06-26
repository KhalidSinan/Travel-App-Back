const express = require('express')
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkObjectID = require('../../../middlewares/checkObjectID');

const upload = require('../../../services/imageUploading');
const { httpPutName, httpPutGender, httpPutDate, httpPutProfilePic, httpGetProfile, httpPutLocation, httpPutPassword, httpDeleteAccount, httpBecomeOrganizer } = require('./users.controller');

const userRouter = express.Router()

userRouter.put('/name', requireJwtAuth, asyncHandler(httpPutName))
// userRouter.put('/gender', requireJwtAuth, asyncHandler(httpPutGender))
userRouter.put('/date', requireJwtAuth, asyncHandler(httpPutDate))
userRouter.put('/location', requireJwtAuth, asyncHandler(httpPutLocation))
userRouter.put('/profile-pic', requireJwtAuth, upload.single('profile_pic'), asyncHandler(httpPutProfilePic))
userRouter.get('/profile', requireJwtAuth, asyncHandler(httpGetProfile))
userRouter.put('/password', requireJwtAuth, asyncHandler(httpPutPassword))
userRouter.delete('/delete-account', requireJwtAuth, asyncHandler(httpDeleteAccount))
userRouter.post('/become-organizer', requireJwtAuth, asyncHandler(httpBecomeOrganizer))


module.exports = userRouter