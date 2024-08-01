const Chat = require('./chats.mongo');


async function getChats(user_id, skip, limit) {
    return await Chat.find({ users_id: { $in: user_id } }).skip(skip).limit(limit)
}

async function getChatsCount(user_id, skip, limit) {
    return await Chat.find({ users_id: { $in: user_id } }).countDocuments()
}

async function getChat(id, user_id) {
    return await Chat.findOne({ trip_id: id, users_id: { $in: user_id } })
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

module.exports = {
    getChats,
    getChatsCount,
    getChat,
    postChat,
    postChatMessage,
    getChatByTripID
}