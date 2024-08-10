function chatData(chat) {
    return {
        id: chat.trip_id,
        chat_name: chat.name,
        last_message: "fix this"
    }
}

module.exports = {
    chatData,
}