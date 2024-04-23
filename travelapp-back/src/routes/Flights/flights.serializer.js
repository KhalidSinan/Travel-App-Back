const { convertToTimeFormat, createDateTimeObject, msToTime } = require("../../services/convertTime");

function reservationData(reservation) {
    const flight = reservation.flights[0];
    let remaining = createDateTimeObject(flight.departure_date.date, flight.departure_date.time) - (Date.now() + 3 * 60 * 60 * 1000)
    const remaining_time = msToTime(remaining - 2 * 60 * 60 * 1000)
    const flight_back = reservation.flights[1];
    let reservation_type = 'One-Way'
    const data = {
        flight: {
            airline: reservation.flights[0].airline.name,
            source: reservation.flights[0].source,
            destination: reservation.flights[0].destination,
            departure_date: reservation.flights[0].departure_date,
            arrival_date: reservation.flights[0].arrival_date,
            duration: convertToTimeFormat(reservation.flights[0].duration),
            reservations: reservation.reservations.data,
            flight_price: reservation.reservations.overall_price
        },
        num_of_reservations: reservation.num_of_reservations,
        reservation_type: reservation_type,
        two_way: false,
        overall_price: reservation.overall_price,
        remaining_time: remaining_time

    }
    if (flight_back) {
        data.flight_back = {
            airline: reservation.flights[1].airline.name,
            source: reservation.flights[1].source,
            destination: reservation.flights[1].destination,
            departure_date: reservation.flights[1].departure_date,
            arrival_date: reservation.flights[1].arrival_date,
            duration: convertToTimeFormat(reservation.flights[1].duration),
            reservations: reservation.reservations_back.data,
            flight_price: reservation.reservations.overall_price
        }
        data.reservation_type = 'Two-Way'
        data.two_way = true;
    }
    return data
}

function flightData(flight) {
    return {
        id: flight._id,
        airline: flight.airline,
        source: flight.source.city,
        destination: flight.destination.city,
        departure_date: flight.departure_date,
        arrival_date: flight.arrival_date.date,
        duration: convertToTimeFormat(flight.duration),
        price: flight.overall_price,
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
        duration: convertToTimeFormat(flight.duration),
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