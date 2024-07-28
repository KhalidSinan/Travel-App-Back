const { serializedData } = require("../../../services/serializeArray");

function flightsData(flight) {
    return {
        source_country: flight.source.country,
        source_city: flight.source.city,
        source_airport: flight.source.name,
        destination_country: flight.destination.country,
        destination_city: flight.destination.city,
        destination_airport: flight.destination.name,

        arrival_date: flight.arrival_date.date,
        departure_date: flight.departure_date.date,

        airline_name: flight.airline.name,
        airline_pic: flight.airline.logo,

        available_seats: flight.available_seats,
        classes: serializedData(flight.classes, classData)
    }
}

function classData(class1) {
    return {
        name: class1.name,
        price: class1.price,
        weight: class1.weight,
        available_seats: class1.available_seats,
        features: class1.features
    }
}

function flightData(flight) {
    return {
        id: flight._id,
        source: flight.source,
        destination: flight.destination,
        arrival_date: flight.arrival_date,
        departure_date: flight.departure_date,
        airline: flight.airline
    }
}

module.exports = {
    flightsData,
    flightData
}