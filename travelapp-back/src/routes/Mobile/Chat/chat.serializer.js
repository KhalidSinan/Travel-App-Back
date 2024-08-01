function chatData(chat) {
    return {
        id: chat.trip_id,
        chat_name: chat.name,
        last_message: "fix this"
    }
}

function chatDetailsData(chat, user_id) {
    return {
        id: chat._id,
        chat_name: chat.name,
        messages: chat.messages
    }
}

module.exports = {
    chatData,
    chatDetailsData
}