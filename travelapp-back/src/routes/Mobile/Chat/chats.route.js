const express = require('express');
const asyncHandler = require('express-async-handler');

const requireJwtAuth = require('../../../middlewares/checkJwtAuth');
const { httpGetAllChats, httpGetOneChat, httpPostChat, httpPostMessage } = require('./chats.controller');
const checkOrganizer = require('../../../middlewares/checkOrganizer');
const checkObjectID = require('../../../middlewares/checkObjectID');

const chatRouter = express.Router();

chatRouter.get('/', requireJwtAuth, asyncHandler(httpGetAllChats));
chatRouter.get('/:id', requireJwtAuth, asyncHandler(httpGetOneChat));
chatRouter.post('/:id/create', requireJwtAuth, checkOrganizer, checkObjectID, asyncHandler(httpPostChat));
// chatRouter.post('/:id/message', requireJwtAuth, checkOrganizer, asyncHandler(httpPostMessage));

module.exports = chatRouter;