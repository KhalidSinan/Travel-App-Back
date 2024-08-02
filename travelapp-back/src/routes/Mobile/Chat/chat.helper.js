function getUsersID(reservations, organizer_id) {
    let temp = reservations.map(reservation => reservation.user_id)
    temp.push(organizer_id)
    return temp
}

function checkMessageFromWho(message, user_id) {
    if (message.sender_id == user_id) {
        message.from_me = true
    }
    else message.from_me = false
    return message
}

module.exports = {
    getUsersID,
    checkMessageFromWho
}