const PlaneReservation = require('./plane-reservation.mongo')

async function postReservation(data) {
    return await PlaneReservation.create(data)
}

module.exports = {
    postReservation
}