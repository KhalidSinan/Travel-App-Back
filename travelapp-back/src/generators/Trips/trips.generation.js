const fs = require('fs')
const airlines = require('../../public/json/airlines.json')
const airports = require('../../public/json/airports.json')
const flightsMongo = require('../../models/flights.mongo')

const airportsNum = airports.length
const airlinesNum = airlines.length

const firstClassFeatures = [
    "Premium seats",
    "Lounge access",
    "Complimentary beverages",
    "Enhanced food options",
    "Amenity kits",
    "luxury toiletries",
    "Designer bedding",
    "Priority billing"
]
const businessClassFeatures = [
    "Lie-flat seats",
    "Enclosed suite",
    "Entertainment unit",
    "Pajamas",
    "Amenity kit",
    "Fast Wi-Fi"
]
const economyClassFeatures = [
    "Free meal",
    "Free beverages",
    "TV screen",
    "Power outlets",
    "Backrests"
]

function createPlace() {
    let { name, city, country } = airports[Math.floor(Math.random() * airportsNum)];
    // name += ' Airport';
    return { name, city, country }
}

function createDate() {
    const date = new Date();
    const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + Math.floor(Math.random() * 30),
        date.getHours() + Math.floor(Math.random() * 24), // Add random hours (0-23)
        Math.floor(Math.random() * 12) * 5  // Set minutes to the nearest lower multiple of 10
    ));

    const dateObj = {
        dateTime: utcDate,
        date: utcDate.toLocaleDateString('en-GB'),
        time: utcDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    };
    return dateObj
}

createDate()

function createAirline() {
    const { name, logo } = airlines[Math.floor(Math.random() * airlinesNum)]
    return { name, logo }
}

// Add Options
function createClasses(available_seats) {
    const first = Math.floor(available_seats / 4);
    const economy = Math.floor(available_seats / 2)
    const business = Math.floor(available_seats - first - economy)
    return [
        {
            "name": "First Class",
            "code": 'A',
            "price": (Math.random() * 800 + 700).toFixed(2),
            "weight": 30,
            "available_seats": first,
            "features": ['Wifi', 'Food']
        },
        {
            "name": "Bussiness Class",
            "code": 'B',
            "price": (Math.random() * 400 + 300).toFixed(2),
            "weight": 25,
            "available_seats": business,
            "features": ['Wifi']
        },
        {
            "name": "Economy Class",
            "code": 'C',
            "price": (Math.random() * 200 + 100).toFixed(2),
            "weight": 30,
            "available_seats": economy,
            "features": ['Nothing']
        }
    ]
}

async function createTrips(num_of_trips) {
    let trips = []
    for (let i = 0; i < num_of_trips; i++) {
        //source
        let source = createPlace()
        while (source.name == '' || source.country == '' || source.city == '') {
            source = createPlace()
        }

        //destination
        let destination = createPlace()
        while (destination.name == '' || destination.country == '' || destination.city == '') {
            destination = createPlace()
        }

        const duration = 60 + Math.floor(Math.random() * 300 / 5) * 5

        const airline = createAirline()

        let departure_date = createDate()
        let arrival_date = new Date(departure_date.dateTime)
        arrival_date = {
            dateTime: arrival_date,
        }
        arrival_date.dateTime.setMinutes(arrival_date.dateTime.getMinutes() + duration)
        arrival_date = {
            dateTime: arrival_date.dateTime,
            date: arrival_date.dateTime.toLocaleDateString('en-GB'),
            time: arrival_date.dateTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        }

        const available_seats = Math.floor(Math.random() * 300)

        const classes = createClasses(available_seats);

        const trip = { source, destination, duration, airline, available_seats, departure_date, arrival_date, classes }
        trips.push(trip)

        // Trip Back
        const trip_back = revertTrip(trip);
        trips.push(trip_back)
    }
    // fs.writeFileSync('trips.json', JSON.stringify(trips))
    await flightsMongo.insertMany(trips)
}

function revertTrip(trip) {
    const extraDays = Math.floor(Math.random() * 30);
    let departure_date = new Date(trip.departure_date.dateTime.setDate(trip.departure_date.dateTime.getDate() + extraDays));
    departure_date = {
        dateTime: departure_date,
        date: departure_date.toLocaleDateString('en-GB'),
        time: departure_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
    let arrival_date = new Date(trip.arrival_date.dateTime.setDate(trip.arrival_date.dateTime.getDate() + extraDays));
    arrival_date = {
        dateTime: arrival_date,
        date: arrival_date.toLocaleDateString('en-GB'),
        time: arrival_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
    const trip_back = {
        source: trip.destination,
        destination: trip.source,
        duration: trip.duration,
        airline: trip.airline,
        available_seats: trip.available_seats,
        departure_date: departure_date,
        arrival_date: arrival_date,
        classes: trip.classes
    }
    return trip_back
}

// createTrips(1);

module.exports = createTrips;