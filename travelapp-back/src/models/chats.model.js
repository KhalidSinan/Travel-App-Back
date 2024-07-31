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

async function postChat(id) {

}

async function postChatMessage(id, message) {

}

module.exports = {
    getChats,
    getChatsCount,
    getChat,
    postChat,
    postChatMessage
}