const Chat = require('./chats.mongo');

async function postChat(id) {

}

async function postChatMessage(id, message) {

}

async function getChats(user_id) {
    return await Chat.find({ users_id: { $in: user_id } })
}

async function getChat(id, user_id) {
    return await Chat.find({ trip_id: id, users_id: { $in: user_id } })
}

module.exports = {
    getChats,
    getChat,
    postChat,
    postChatMessage
}