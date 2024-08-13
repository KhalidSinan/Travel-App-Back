const Chat = require('./chats.mongo');

async function getChats(user_id, skip, limit) {
    return await Chat.find({ users_id: { $elemMatch: { id: user_id } } })
        .populate({ path: 'trip_id', populate: { path: 'trip_id' } })
        .skip(skip).
        limit(limit)
}

async function getChatsCount(user_id, skip, limit) {
    return await Chat.find({ users_id: { $elemMatch: { id: user_id } } }).countDocuments()
}

async function getChat(id, user_id) {
    return await Chat.findOne({ trip_id: id, users_id: { $elemMatch: { id: user_id } } }).populate('messages.sender_id', 'name')
}

async function getChatByTripID(trip_id) {
    return await Chat.findOne({ trip_id: trip_id })
}

async function postChat(data) {
    return await Chat.create(data)
}

async function postChatMessage(chat, message) {
    chat.messages.push(message)
    await chat.save()
}

async function getLatestMessage(chatId) {
    const chat = await Chat.findOne({ _id: chatId })
        .populate({
            path: 'messages.sender_id',
            select: 'name profile_pic'
        })
        .select({ messages: { $slice: -1 } });

    return chat.messages[0];
}

async function addUserToChat(id, data) {
    const chat = await Chat.findOne({ trip_id: id })
    if (!chat.users_id.some(user => user.id.equals(data.id))) chat.users_id.push(data);
    await chat.save()
}


module.exports = {
    getChats,
    getChatsCount,
    getChat,
    postChat,
    postChatMessage,
    getChatByTripID,
    getLatestMessage,
    addUserToChat
}