const express = require('express');
const asyncHandler = require('express-async-handler');
const { login, httpGetAllAdmins, httpPostAdmin, httpDeleteAdmin, logout, httpSearchAdmins } = require('./admins.controller')

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkSuperAdmin = require('../../../middlewares/checkSuperAdmin')
const checkAdmin = require('../../../middlewares/checkAdmin')
const checkObjectID = require('../../../middlewares/checkObjectID');

const adminRouter = express.Router();

adminRouter.post('/login', asyncHandler(login));
adminRouter.get('/admins', requireJwtAuth, checkAdmin, asyncHandler(httpGetAllAdmins));
adminRouter.get('/admins/search', requireJwtAuth, checkAdmin, asyncHandler(httpSearchAdmins));
adminRouter.post('/admin', requireJwtAuth, checkAdmin, checkSuperAdmin, asyncHandler(httpPostAdmin));
adminRouter.delete('/admin/:id', requireJwtAuth, checkAdmin, checkSuperAdmin, checkObjectID, asyncHandler(httpDeleteAdmin));
adminRouter.post('/logout', requireJwtAuth, checkAdmin, asyncHandler(logout));


module.exports = adminRouter;