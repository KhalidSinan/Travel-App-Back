function reservationData(reservation) {
    return {
        airline: reservation.flight_id[0].airline,
        source: reservation.flight_id[0].source,
        destination: reservation.flight_id[0].destination,
        due_date: reservation.flight_id[0].due_date,
        num_of_reservations: reservation.num_of_reservations,
        reservations: reservation.reservations
    }
}

module.exports = {
    reservationData
}