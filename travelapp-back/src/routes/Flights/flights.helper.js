const fs = require('fs')
const countries = require('../../public/json/countries-all.json')
const airlines = require('../../public/json/airlines.json')
const { convertTime12to24, createDateTimeObject } = require('../../services/convertTime');

function getFlightsReqDataHelper(req) {
    // Body
    const source = req.body.source
    const destination = req.body.destination
    const date = req.body.date
    const num_of_seats = req.body.num_of_seats
    const class_of_seats = req.body.class_of_seats
    const two_way = req.body.two_way
    const date_end = req.body.date_end

    // Query Param
    const sort = req.query.sort
    const sortBy = req.query.sortBy
    const airline = req.query.airline
    const time_start = req.query.time_start
    const time_end = req.query.time_end
    const min_price = req.query.min_price
    const max_price = req.query.max_price

    // To Stop Duplicate
    delete req.query.skip
    delete req.query.limit
    delete req.query.sort
    delete req.query.sortBy
    delete req.query.airline
    delete req.query.time_start
    delete req.query.time_end
    delete req.query.min_price
    delete req.query.max_price

    return { source, destination, date, num_of_seats, class_of_seats, sort, sortBy, two_way, date_end, airline, time_start, time_end, min_price, max_price }
}

// function getFlightsReqDataHelper(req) {
//     const source = req.query.source
//     const destination = req.query.destination
//     const num_of_seats = req.query.num_of_seats
//     const class_of_seats = req.query.class_of_seats
//     const sort = req.query.sort
//     const type = req.query.type
//     const date_end = req.query.date_end
//     const date = req.query.date
//     const airline = req.query.airline
//     const time_start = req.query.time_start
//     const time_end = req.query.time_end

//     // To Stop Duplicate
//     delete req.query.skip
//     delete req.query.limit
//     delete req.query.date
//     delete req.query.source
//     delete req.query.destination
//     delete req.query.class_of_seats
//     delete req.query.num_of_seats
//     delete req.query.sort
//     delete req.query.type
//     delete req.query.date_end
//     delete req.query.airline
//     delete req.query.time_start
//     delete req.query.time_end

//     return { source, destination, num_of_seats, class_of_seats, sort, type, date, date_end, airline, time_start, time_end }
// }

function getFlightsTimeFilterHelper(date, time_start, time_end, data) {
    let dateArray = date.split("/");
    let newDate = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;

    // Start Time
    time_start = createDateTimeObject(newDate, time_start)

    // End Time
    time_end = createDateTimeObject(newDate, time_end)

    // Finding flights based on time
    let temp = []
    data.forEach(flight => {
        if (flight.departure_date.dateTime <= time_end && flight.departure_date.dateTime >= time_start) temp.push(flight)
    })
    return temp
}

function getTwoWayFlightsTimeFilterHelper(date, time_start, time_end, data) {
    let dateArray = date.split("/");
    let newDate = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;

    // Start Time
    time_start = createDateTimeObject(newDate, time_start)

    // End Time
    time_end = createDateTimeObject(newDate, time_end)

    // Finding flights based on time
    let temp = []
    data.forEach(flight => {
        if (flight.flight.departure_date.dateTime <= time_end && flight.flight.departure_date.dateTime >= time_start) temp.push(flight)
    })
    return temp
}

function getFlightsPriceFilterHelper(min_price, max_price, data) {
    // Finding flights based on price
    let temp = []
    data.forEach(flight => {
        if (+flight.overall_price <= max_price && +flight.overall_price >= min_price) temp.push(flight)
    })
    return temp
}

function getFlightsSeatsCalculateHelper(flight, seats, classIndex) {
    return flight.classes[classIndex].available_seats >= seats
}

function getFlightsOneWayDataHelper(flights, num_of_seats, classIndex, airline = null) {
    let data = []
    flights.forEach(flight => {
        if (flight && getFlightsSeatsCalculateHelper(flight, num_of_seats, classIndex) && flight.departure_date.dateTime > Date.now()) {
            flight.overall_price = flight.classes[classIndex].price
            data.push(flight)
            if (airline && flight.airline.name != airline) data.pop();
        }
    })
    return data
}

function getFlightsTwoWayDataHelper(flights, flights_back, num_of_seats, classIndex, airline = null) {
    let data = [];
    flights.forEach(flight => {
        flights_back.forEach(flight_back => {
            let temp = { flight, flight_back }
            const date = flight.departure_date.dateTime
            if (temp.flight.departure_date.dateTime <= temp.flight_back.departure_date.dateTime) {
                if (getFlightsSeatsCalculateHelper(flight, num_of_seats, classIndex) && getFlightsSeatsCalculateHelper(flight_back, num_of_seats, classIndex) && date.valueOf() > Date.now()) {
                    temp.flight_back.overall_price = flight_back.classes[classIndex].price
                    temp.flight.overall_price = flight.classes[classIndex].price
                    temp.overall_price = (temp.flight_back.overall_price + temp.flight.overall_price).toFixed(2)
                    data.push(temp)
                    if (airline && (flight.airline.name != airline && flight_back.airline.name != airline)) data.pop()
                }
            }
        })
    })
    return data
}

function getFlightsPriceSortHelper(sort = null, data) {
    data.sort((a, b) => a.overall_price - b.overall_price)
    if (sort == 'desc') {
        data.reverse();
    }
}

function getFlightsDateSortHelper(sort = null, data) {
    data.sort((a, b) => a.date - b.date)
    if (sort == 'desc') {
        data.reverse();
    }
}

function getTwoWayFlightsDateSortHelper(sort = null, data) {
    data.sort((a, b) => a.flight.departure_date.dateTime - b.flight.departure_date.dateTime)
    if (sort == 'desc') {
        data.reverse();
    }
}

function oneWaySorter(sortBy = null, sort = null, data) {
    if (sortBy == 'price') getFlightsPriceSortHelper(sort, data)
    else if (sortBy == 'time') getFlightsDateSortHelper(sort, data)
}

function twoWaySorter(sortBy = null, sort = null, data) {
    if (sortBy == 'price') getFlightsPriceSortHelper(sort, data)
    else if (sortBy == 'time') getTwoWayFlightsDateSortHelper(sort, data)
}


function getCountries() {
    let data = []
    countries.forEach(country => data.push(country.name))
    return data;
}

function getAirlines() {
    let data = []
    airlines.forEach(airline => data.push(airline.name))
    return data;
}



module.exports = {
    getFlightsReqDataHelper,
    getFlightsOneWayDataHelper,
    getFlightsTwoWayDataHelper,
    getFlightsTimeFilterHelper,
    getCountries,
    getAirlines,
    getFlightsPriceFilterHelper,
    oneWaySorter,
    twoWaySorter,
    getTwoWayFlightsTimeFilterHelper,
}