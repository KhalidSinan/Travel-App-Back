const { getReservation } = require("../../../models/plane-reservation.model");

async function reserveFlightHelper(reservations, flight, user_id) {
    const classes = ['A', 'B', 'C'];
    let price = 0;
    reservations.forEach(reservation => {
        reservation.price = flight.classes[classes.indexOf(reservation.seat_class)].price
        reservation.user_id = user_id;
        price += reservation.price
        reservation.seat_number = reservation.seat_class + flight.classes[classes.indexOf(reservation.seat_class)].available_seats
        flight.available_seats--;
        flight.classes[classes.indexOf(reservation.seat_class)].available_seats--;
    })
    // Save Flight Changes
    await flight.save();
    return { price, reserv: reservations }
}

async function findCancelRate(reservation, person_price) {
    const date = reservation.flights[0].departure_date.dateTime
    const timeDifference = date - new Date(Date.now() + 3 * 60 * 60 * 1000)
    const chance = 2 * 60 * 60 * 1000
    let rate = 0.2; // 0.2 will be back
    if (timeDifference < chance) rate = 0; // Nothing is back
    return person_price * rate
}

function changeClassName(reservations, reservations_back) {
    let classesMap = new Map([['A', 'First'], ['B', 'Business'], ['C', 'Economy']])
    reservations.data.forEach(reservation => {
        reservation.seat_class = classesMap.get(reservation.seat_class)
    })
    if (reservations_back != null)
        if (reservations_back.length != 0) {
            reservations_back.data.forEach(reservation => {
                reservation.seat_class = classesMap.get(reservation.seat_class)
            })
        }
}

function getUpcomingReservations(reservations) {
    let data = [];
    reservations.forEach(reservation => {
        const flights = reservation.flights
        flights.forEach(flight => {
            if (flight.arrival_date.dateTime > new Date()) {
                let temp = {
                    city: flight.destination.city,
                    date: flight.arrival_date.dateTime,
                    date2: flight.arrival_date.date,
                }
                data.push(temp)
            }
        })
    })
    return data;
}

async function checkFlightsReservations(flights) {
    let check = true
    await Promise.all(
        flights.map(async (flight) => {
            let temp = await getReservation(flight)
            if (!temp) check = false;
        })
    )
    return check
}

function getNearestReservationHelper(data) {
    let nearestReservation = data[0]
    for (const reservation of data) {
        const departureDate = new Date(reservation.flights[0].departure_date.dateTime); // Replace with actual property name for departure date
        if (departureDate < new Date(nearestReservation.flights[0].departure_date.dateTime) && departureDate > new Date()) {
            nearestReservation = reservation;
        }
    }
    return nearestReservation
}

function createPDFDataForTicket(reservation) {
    return data = {
        airline_name: reservation.flights[0].airline.name,
        airline_logo: reservation.flights[0].airline.logo,
        source: reservation.flights[0].source.name,
        destination: reservation.flights[0].destination.name,
        departure_date_date: reservation.flights[0].departure_date.date,
        departure_date_time: reservation.flights[0].departure_date.time,
        arrival_date_date: reservation.flights[0].arrival_date.date,
        arrival_date_time: reservation.flights[0].arrival_date.time,
        duration: reservation.flights[0].duration,
        reservations: reservation.reservations.data.map(res => ({
            person_name: res.person_name,
            seat_class: res.seat_class,
            person_passport: res.person_passport,
            seat_number: res.seat_number,
            price: res.price,
        })),
        overall_price: reservation.overall_price,
    }
}

module.exports = {
    findCancelRate,
    reserveFlightHelper,
    changeClassName,
    getUpcomingReservations,
    checkFlightsReservations,
    getNearestReservationHelper,
    createPDFDataForTicket
}