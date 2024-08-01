function getUsersID(reservations, organizer_id) {
    let temp = reservations.map(reservation => reservation.user_id)
    temp.push(organizer_id)
    return temp
}

module.exports = {
    getUsersID,
}