const { getChat, postChat } = require('../../../models/chats.model')

async function httpGetAllChats(req, res) {
    const user = req.user._id
    const chats = await httpGetAllChats(user)
    return res.status(200).json({ data: chats })
}

async function httpGetOneChat(req, res) {
    const chatID = req.params.id
    const chat = await getChat(chatID)
    return chat
}

async function httpPostChat(sender, receiver) {
    const data = {
        organizer_id,
        users_id,
        trip_id,
        name
    }
    await postChat(data)
    return res.status(200).json({
        message: 'Chat Successfully Created'
    })
}

async function httpPostMessage(chatID, message) {
    // const sender = req.user._id
    const chat = await getOneChat(chatID)
    const messages = await addMessageToChat(chat, message)
    return messages
}

// async function httpPutMessage(chatID, oldMessageID, message) {
//     // const sender = req.user._id
//     const chat = await getOneChat(chatID)
//     await updateMessage(chat, oldMessageID, message)
//     return chat.messages
// }

// async function httpDeleteMessage(chatID, message) {
//     // const sender = req.user._id
//     const chat = await getOneChat(chatID)
//     await deleteMessage(chat, message)
//     return chat.messages
// }

module.exports = {
    httpGetAllChats,
    httpGetOneChat,
    httpPostChat,
    httpPostMessage,
    // httpPutMessage,
    // httpDeleteMessage
}