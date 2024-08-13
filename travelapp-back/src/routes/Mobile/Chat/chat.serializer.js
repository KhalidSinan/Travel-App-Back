function chatData(chat) {
    const seatsTaken = chat.trip_id.overall_seats - chat.trip_id.available_seats
    return {
        id: chat.trip_id._id,
        chat_name: chat.name,
        start_date: chat.trip_id.trip_id.start_date,
        end_date: chat.trip_id.trip_id.end_date,
        num_of_people: `${seatsTaken}/${chat.trip_id.overall_seats}`,
        last_message: "fix this"
    }
}

module.exports = {
    chatData,
}