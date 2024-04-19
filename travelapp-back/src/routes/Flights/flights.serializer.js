function reservationData(reservation) {
    return {
        airline: reservation.flight_id[0].airline,
        source: reservation.flight_id[0].source,
        destination: reservation.flight_id[0].destination,
        departure_date: reservation.flight_id[0].departure_date,
        num_of_reservations: reservation.num_of_reservations,
        reservations: reservation.reservations,
        // cancel_fee: reservation.overall_price - reservation.fee,
        // returned_fee: reservation.fee
    }
}

function flightData(flight) {
    return {
        id: flight._id,
        airline: flight.airline,
        source: flight.source.country,
        destination: flight.destination.country,
        departure_date: flight.departure_date,
        arrival_date: flight.arrival_date.date,
        duration: flight.duration,
        price: flight.price
    }
}

function twoWayFlightData(two_way) {
    return {
        flight: flightData(two_way.flight),
        flight_back: flightData(two_way.flight_back),
        overall_price: two_way.overall_price
    }
}

function twoWayFlightDataDetails(two_way) {
    return {
        flight: flightDataDetails(two_way.flight),
        flight_back: flightDataDetails(two_way.flight_back),
        overall_price: two_way.overall_price
    }
}

function flightDataDetails(flight) {
    return {
        id: flight._id,
        airline: flight.airline,
        source: flight.source,
        destination: flight.destination,
        departure_date: flight.departure_date,
        arrival_date: flight.arrival_date,
        duration: flight.duration,
        classes: flight.classes
    }
}

module.exports = {
    reservationData,
    flightData,
    twoWayFlightData,
    flightDataDetails,
    twoWayFlightDataDetails
}