const express = require('express');
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const { httpGetAllChats, httpPostChat, httpJoinChat } = require('./chats.controller');
const checkOrganizer = require('../../../middlewares/checkOrganizer');
const checkObjectID = require('../../../middlewares/checkObjectID');

const chatRouter = express.Router();

chatRouter.get('/', requireJwtAuth, asyncHandler(httpGetAllChats));
chatRouter.post('/:id/create', requireJwtAuth, checkOrganizer, checkObjectID, asyncHandler(httpPostChat));
chatRouter.get('/:id/join', requireJwtAuth, checkObjectID, asyncHandler(httpJoinChat));

module.exports = chatRouter;