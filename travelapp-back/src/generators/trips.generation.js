const fs = require('fs')
const airlines = require('../public/json/airlines.json')
const airports = require('../public/json/airports.json')
const flightsMongo = require('../models/flights.mongo')

const airportsNum = airports.length
const airlinesNum = airlines.length

const firstClassFeatures = [
    "Spa",
    "Beverages",
    "Buffet",
    "Shower",
    "Bedding"
]
const businessClassFeatures = [
    "Lie seats",
    "Privacy",
    "Entertainment",
    "Fast Food",
    "Wifi"
]
const economyClassFeatures = [
    "Meal",
    "Drinks",
    "TV",
    "Charging",
    "Backrest"
]


// const firstClassFeatures = [
//     "Comfort",
//     "Beverages",
//     "Buffet",
//     "Toiletries",
//     "Bedding"
// ]
// const businessClassFeatures = [
//     "Lie seats",
//     "Suite",
//     "Entertainment",
//     "Pajamas",
//     "Wifi"
// ]
// const economyClassFeatures = [
//     "Meal",
//     "Drinks",
//     "TV",
//     "Charging",
//     "Backrest"
// ]

// const firstClassFeatures = [
//     "Premium Seats",
//     "Lounge Access",
//     "Complimentary Beverages",
//     "Enhanced Food Options",
//     "Amenity Kits",
//     "Luxury Toiletries",
//     "Designer Bedding",
//     "Priority Billing"
// ]
// const businessClassFeatures = [
//     "Lie-flat Seats",
//     "Enclosed Suite",
//     "Entertainment Unit",
//     "Pajamas",
//     "Amenity Kit",
//     "Fast Wi-Fi"
// ]
// const economyClassFeatures = [
//     "Free Meal",
//     "Free Beverages",
//     "TV Screen",
//     "Power Outlets",
//     "Backrests"
// ]

function getRandomUniqueElements(array, n) {
    const features = new Set();
    while (features.size < n) {
        const randomIndex = Math.floor(Math.random() * array.length);
        features.add(array[randomIndex]);
    }
    return Array.from(features);
}

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
            "features": getRandomUniqueElements(firstClassFeatures, 3)
        },
        {
            "name": "Business Class",
            "code": 'B',
            "price": (Math.random() * 400 + 300).toFixed(2),
            "weight": 25,
            "available_seats": business,
            "features": getRandomUniqueElements(businessClassFeatures, 3)
        },
        {
            "name": "Economy Class",
            "code": 'C',
            "price": (Math.random() * 200 + 100).toFixed(2),
            "weight": 30,
            "available_seats": economy,
            "features": getRandomUniqueElements(economyClassFeatures, 3)
        }
    ]
}

async function createFlights(num_of_trips, sourceSent = null, lastDepartureDate = null) {
    let trips = []
    for (let i = 0; i < num_of_trips; i++) {
        //source
        let source = createPlace()
        while (source.name == '' || source.country == '' || source.city == '') {
            source = createPlace()
        }
        if (sourceSent) {
            let { name, city, country } = airports.find(airport => airport.country == sourceSent)
            source = { name, city, country }
        }

        //destination
        let destination = createPlace()
        while (destination.name == '' || destination.country == '' || destination.city == '') {
            destination = createPlace()
        }

        const duration = 60 + Math.floor(Math.random() * 300 / 5) * 5

        const airline = createAirline()

        let departure_date = createDate()
        if (lastDepartureDate) {
            tempDate = new Date(lastDepartureDate)
            tempDate.setUTCDate(tempDate.getDate() + 1);
            departure_date = {
                dateTime: tempDate,
                date: tempDate.toLocaleDateString('en-GB'),
                time: tempDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            }
        }

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
        const overall_seats = available_seats

        const classes = createClasses(available_seats);

        const trip = { source, destination, duration, airline, overall_seats, available_seats, departure_date, arrival_date, classes }
        trips.push(trip)

        // Trip Back
        const trip_back = revertTrip(trip);
        trips.push(trip_back)
    }
    // fs.writeFileSync('trips.json', JSON.stringify(trips))
    const insertedTrips = await flightsMongo.insertMany(trips)
    return insertedTrips
}

function revertTrip(trip) {
    const extraDays = Math.floor(Math.random() * 30);
    let departure_date = new Date(trip.departure_date.dateTime);
    departure_date.setDate(departure_date.getDate() + extraDays)
    departure_date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 12) * 5)
    departure_date = {
        dateTime: departure_date,
        date: departure_date.toLocaleDateString('en-GB'),
        time: departure_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
    let arrival_date = new Date(departure_date.dateTime);
    arrival_date.setMinutes(departure_date.dateTime.getMinutes() + trip.duration)
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
        overall_seats: trip.overall_seats,
        available_seats: trip.available_seats,
        departure_date: departure_date,
        arrival_date: arrival_date,
        classes: trip.classes
    }
    return trip_back
}

// createTrips(1);

module.exports = createFlights;