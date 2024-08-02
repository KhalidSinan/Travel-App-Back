const { msToTime, convertToTimeFormat } = require("../../../services/convertTime");

function reservationData(reservation) {
    const flight = reservation.flights[0];
    let remaining = flight.departure_date.dateTime.valueOf() - Date.now()
    let remaining_time = msToTime(remaining)
    if (remaining_time.seconds < 0) remaining_time = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const flight_back = reservation.flights[1];
    let reservation_type = 'One-Way'
    const data = {
        flight: {
            airline: {
                name: reservation.flights[0].airline.name
            },
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
        remaining_time: remaining_time,
        is_confirmed: reservation.is_confirmed
    }
    if (flight_back) {
        data.flight_back = {
            airline: {
                name: reservation.flights[1].airline.name
            },
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

function allReservationData(reservation) {
    const date = reservation.flights[1] ? reservation.flights[1].arrival_date.dateTime : reservation.flights[0].arrival_date.dateTime
    let price = reservation.reservations.overall_price + (reservation.reservations_back?.overall_price ?? 0)
    return {
        id: reservation._id,
        source: reservation.flights[0].source.country,
        destination: reservation.flights[0].destination.country,
        airport: reservation.flights[0].source.name,
        reservation_type: reservation.reservation_type,
        num_of_reservations: reservation.num_of_reservations,
        overall_price: price,
        departure_date: reservation.flights[0].departure_date.date,
        completed: new Date(date) < Date.now()
    }
}

module.exports = { reservationData, allReservationData }