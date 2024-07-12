const express = require('express');
const asyncHandler = require('express-async-handler');
const { login, httpGetAllAdmins, httpPostAdmin, httpDeleteAdmin, logout, httpSearchAdmins } = require('./admins.controller')

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const checkSuperAdmin = require('../../../middlewares/checkSuperAdmin')
const checkAdmin = require('../../../middlewares/checkAdmin')
const checkObjectID = require('../../../middlewares/checkObjectID');

const adminRouter = express.Router();

adminRouter.post('/login', asyncHandler(login));
adminRouter.get('/admins', requireJwtAuth, checkSuperAdmin, asyncHandler(httpGetAllAdmins));
adminRouter.get('/admins/search', requireJwtAuth, checkSuperAdmin, asyncHandler(httpSearchAdmins));
adminRouter.post('/admin', requireJwtAuth, checkSuperAdmin, asyncHandler(httpPostAdmin));
adminRouter.delete('/admin/:id', requireJwtAuth, checkSuperAdmin, checkObjectID, asyncHandler(httpDeleteAdmin));
adminRouter.post('/logout', requireJwtAuth, checkAdmin, asyncHandler(logout));


module.exports = adminRouter;