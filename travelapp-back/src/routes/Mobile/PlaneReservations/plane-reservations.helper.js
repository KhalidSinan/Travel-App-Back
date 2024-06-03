
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

module.exports = {
    findCancelRate,
    reserveFlightHelper,
    changeClassName,
    getUpcomingReservations
}