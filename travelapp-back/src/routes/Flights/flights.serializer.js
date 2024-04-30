const { convertToTimeFormat, createDateTimeObject, msToTime } = require("../../services/convertTime");

function reservationData(reservation) {
    const flight = reservation.flights[0];
    let remaining = flight.departure_date.dateTime.valueOf() - Date.now()
    let remaining_time = msToTime(remaining)
    if (remaining_time.seconds < 0) remaining_time = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const flight_back = reservation.flights[1];
    let reservation_type = 'One-Way'
    const data = {
        flight: {
            airline: reservation.flights[0].airline.name,
            source: reservation.flights[0].source,
            destination: reservation.flights[0].destination,
            departure_date: {
                date: reservation.flights[0].departure_date.date,
                time: reservation.flights[0].departure_date.time,
            },
            arrival_date: {
                date: reservation.flights[0].arrival_date.date,
                time: reservation.flights[0].arrival_date.time,
            },
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
            departure_date: {
                date: reservation.flights[1].departure_date.date,
                time: reservation.flights[1].departure_date.time,
            },
            arrival_date: {
                date: reservation.flights[1].arrival_date.date,
                time: reservation.flights[1].arrival_date.time,
            },
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
        flight: {
            id: flight._id,
            airline: flight.airline,
            source: {
                city: flight.source.city
            },
            destination: {
                city: flight.destination.city
            },
            departure_date: {
                date: flight.departure_date.date,
                time: flight.departure_date.time,
            },
            arrival_date: {
                date: flight.arrival_date.date
            },
            duration: convertToTimeFormat(flight.duration),
            price: flight.overall_price,
        }
    }
}

function twoWayFlightData(two_way) {
    return {
        flight: flightData(two_way.flight).flight,
        flight_back: flightData(two_way.flight_back).flight,
        overall_price: two_way.overall_price
    }
}

function twoWayFlightDataDetails(two_way) {
    return {
        flight: flightDataDetails(two_way.flight),
        flight_back: flightDataDetails(two_way.flight_back),
        overall_price: two_way.overall_price,
    }
}

function flightDataDetails(flight) {
    let flight_class = {
        name: flight.class.name,
        price: flight.class.price,
        weight: flight.class.weight,
        features: flight.class.features,
    }
    return {
        id: flight._id,
        airline: flight.airline,
        source: flight.source,
        destination: flight.destination,
        departure_date: {
            date: flight.departure_date.date,
            time: flight.departure_date.time,
        },
        arrival_date: {
            date: flight.arrival_date.date,
            time: flight.arrival_date.time,
        },
        duration: convertToTimeFormat(flight.duration),
        class: flight_class
    }
}

module.exports = {
    reservationData,
    flightData,
    twoWayFlightData,
    flightDataDetails,
    twoWayFlightDataDetails
}