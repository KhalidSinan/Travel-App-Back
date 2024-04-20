const { convertTime12to24 } = require('../../services/convertTime');

function getFlightsReqDataHelper(req) {
    const source = req.query.source
    const destination = req.query.destination
    const num_of_seats = req.query.num_of_seats
    const class_of_seats = req.query.class_of_seats
    const sort = req.query.sort
    const type = req.query.type
    const date_end = req.query.date_end
    const date = req.query.date
    const airline = req.query.airline
    const time_start = req.query.time_start
    const time_end = req.query.time_end

    // To Stop Duplicate
    delete req.query.skip
    delete req.query.limit
    delete req.query.date
    delete req.query.source
    delete req.query.destination
    delete req.query.class_of_seats
    delete req.query.num_of_seats
    delete req.query.sort
    delete req.query.type
    delete req.query.date_end
    delete req.query.airline
    delete req.query.time_start
    delete req.query.time_end

    return { source, destination, num_of_seats, class_of_seats, sort, type, date, date_end, airline, time_start, time_end }
}

function getFlightsTimeFilterHelper(date, time_start, time_end, data) {
    // Start Time
    const date1 = createDateTimeObject(date, time_start)
    // const date1 = new Date(date)
    // date1.setTime(date1.valueOf() + 3 * 60 * 60 * 1000) // To Fix Timezones
    // time_start = convertTime12to24(time_start)
    // date1.setUTCHours(time_start[0], time_start[1], time_start[2])

    // End Time
    const date2 = createDateTimeObject(date, time_end)
    // const date2 = new Date(date)
    // date2.setTime(date2.valueOf() + 3 * 60 * 60 * 1000) // To Fix Timezones
    // time_end = convertTime12to24(time_end)
    // date2.setUTCHours(time_end[0], time_end[1], time_end[2])

    // Converting to ms
    time_start = date1.valueOf()
    time_end = date2.valueOf()

    // Finding flights based on time
    let temp = []
    data.forEach(flight => {
        const flight_date = new Date(flight.departure_date.date)
        flight_date.setTime(flight_date.valueOf() + 3 * 60 * 60 * 1000) // To Fix Timezones
        const time = convertTime12to24(flight.departure_date.time)
        flight_date.setUTCHours(time[0], time[1], time[2])
        if (flight_date.valueOf() < time_end && flight_date.valueOf() > time_start) temp.push(flight)
    })
    return temp
}

function getFlightsSeatsCalculateHelper(flight, seats, classIndex) {
    return flight.classes[classIndex].available_seats >= seats
}

function getFlightsOneWayDataHelper(flights, num_of_seats, classIndex, airline = null) {
    let data = []
    flights.forEach(flight => {
        const date = createDateTimeObject(flight.departure_date.date, flight.departure_date.time)
        if (flight && getFlightsSeatsCalculateHelper(flight, num_of_seats, classIndex) && date.valueOf() > Date.now()) {
            flight.overall_price = flight.classes[classIndex].price
            data.push(flight)
            if (airline && flight.airline.name != airline) data.pop()
        }
    })
    return data
}

function getFlightsTwoWayDataHelper(flights, flights_back, num_of_seats, classIndex, airline = null) {
    let data = [];
    flights.forEach(flight => {
        flights_back.forEach(flight_back => {
            let temp = { flight, flight_back }
            if (getFlightsSeatsCalculateHelper(flight, num_of_seats, classIndex) && getFlightsSeatsCalculateHelper(flight_back, num_of_seats, classIndex)) {
                temp.flight_back.overall_price = flight_back.classes[classIndex].price
                temp.flight.overall_price = flight.classes[classIndex].price
                temp.overall_price = (temp.flight_back.overall_price + temp.flight.overall_price).toFixed(2)
                data.push(temp)
                if (airline && (flight.airline.name != airline && flight_back.airline.name != airline)) data.pop()
            }
        })
    })
    return data
}

function getFlightsDataSortHelper(sort = null, data) {
    if (sort) data.sort((a, b) => a.overall_price - b.overall_price)
    if (sort == 'desc') {
        data.reverse();
    }
}

async function reserveFlightHelper(reservations, flight, user_id) {
    const classes = ['A', 'B', 'C']
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
    const date = new Date(reservation.flights[0].departure_date.date)
    date.setTime(date.valueOf() + 3 * 60 * 60 * 1000) // To Fix Timezones
    const time = convertTime12to24(reservation.flights[0].departure_date.time)
    date.setUTCHours(time[0], time[1], time[2])
    const timeDifference = date - Date.now()
    const chance = 2 * 60 * 60 * 1000
    let rate = 0.2; // 0.2 will be back
    if (timeDifference < chance) rate = 0; // Nothing is back
    return person_price * rate
}

function createDateTimeObject(date, time) {
    const temp = new Date(date)
    temp.setTime(temp.valueOf() + 3 * 60 * 60 * 1000) // To Fix Timezones
    time = convertTime12to24(time)
    temp.setUTCHours(time[0], time[1], time[2])
    return temp;
}

module.exports = {
    getFlightsDataSortHelper,
    getFlightsReqDataHelper,
    getFlightsOneWayDataHelper,
    getFlightsTwoWayDataHelper,
    getFlightsTimeFilterHelper,
    reserveFlightHelper,
    findCancelRate
}