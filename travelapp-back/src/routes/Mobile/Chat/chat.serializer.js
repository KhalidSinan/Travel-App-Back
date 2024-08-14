function chatData(chat) {
    const name = chat.messages[chat.messages.length - 1].sender_id.name.first_name + ' ' + chat.messages[chat.messages.length - 1].sender_id.name.last_name
    const seatsTaken = chat.trip_id.overall_seats - chat.trip_id.available_seats
    let last_message = ''
    if (chat.messages.length > 0) last_message = `${name}: ${chat.messages[chat.messages.length - 1].content}`
    return {
        id: chat.trip_id._id,
        chat_name: chat.name,
        start_date: chat.trip_id.trip_id.start_date.toLocaleDateString('en-GB'),
        end_date: chat.trip_id.trip_id.end_date.toLocaleDateString('en-GB'),
        num_of_people: `${seatsTaken}/${chat.trip_id.overall_seats}`,
        last_message: last_message
    }
}

function joinableChatData(chat) {
    return {
        id: chat.trip_id._id,
        chat_name: chat.name,
        start_date: chat.trip_id.trip_id.start_date.toLocaleDateString('en-GB'),
        end_date: chat.trip_id.trip_id.end_date.toLocaleDateString('en-GB'),
        num_of_people: `${seatsTaken}/${chat.trip_id.overall_seats}`,
    }
}

module.exports = {
    chatData,
    joinableChatData
}