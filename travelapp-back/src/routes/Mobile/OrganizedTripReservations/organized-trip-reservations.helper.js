function getReservationDataForTripHelper(reservations) {
    let reservation_data = [];
    reservations.forEach(reservation => {
        reservation_data.push(...reservation.reservation_data)
    })
    return reservation_data
}

module.exports = getReservationDataForTripHelper