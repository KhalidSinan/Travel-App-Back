const { convertToTimeFormat } = require("../../../services/convertTime");

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
    flightData,
    twoWayFlightData,
    flightDataDetails,
    twoWayFlightDataDetails
}