function reservationData(reservation) {
    return {
        airline: reservation.flight_id[0].airline,
        source: reservation.flight_id[0].source,
        destination: reservation.flight_id[0].destination,
        due_date: reservation.flight_id[0].due_date,
        num_of_reservations: reservation.num_of_reservations,
        reservations: reservation.reservations,
        cancel_fee: reservation.overall_price - reservation.fee,
        returned_fee: reservation.fee
    }
}

function flightData(flight) {
    return {
        id: flight._id,
        airline: flight.airline,
        source: flight.source,
        destination: flight.destination,
        due_date: flight.due_date,
        duration: flight.duration
    }
}

function twoWayFlightData(two_way) {
    return {
        flight: flightData(two_way.flight),
        flight_back: flightData(two_way.flight_back),
    }
}

module.exports = {
    reservationData,
    flightData,
    twoWayFlightData
}