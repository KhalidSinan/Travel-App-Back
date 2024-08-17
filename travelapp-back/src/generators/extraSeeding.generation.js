const { faker } = require('@faker-js/faker')
const numbers = require('../public/json/phone_number.json')
const User = require('../models/users.mongo')
const Announcements = require('../models/announcements.mongo')
const Organizer = require('../models/organizers.mongo')
const Report = require('../models/reports.mongo')
const PlaneReservation = require('../models/plane-reservation.mongo')
const Flight = require('../models/flights.mongo')
const Trip = require('../models/trips.mongo')
const Place = require('../models/places.mongo')
const Hotel = require('../models/hotels.mongo')
const HotelReservation = require('../models/hotel-reservation.mongo')
const OrganizedTrip = require('../models/organized-trips.mongo')
const AnnouncementRequest = require('../models/announcement-requests.mongo')
const bcrypt = require('bcrypt');
const { createFlights } = require('./trips.generation')
const OrganizedTripReservation = require('../models/organized-trip-reservations.mongo')
const OrganizerRequest = require('../models/organizer-request.mongo')
const locations = require('../public/json/countries-all.json')
const Chat = require('../models/chats.mongo')
const Notification = require('../models/notifications.mongo')
// Done
async function createUsers(count = 2000) {
    let data1 = []
    for (let i = 0; i < count; i++) {
        const _id = faker.database.mongodbObjectId()
        const name = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        }
        const email = faker.internet.email()
        const email_confirmed = true
        const phone = createPhoneNumber()
        const password = await bcrypt.hash('12345678', 1)
        const gender = faker.datatype.boolean() ? 'Male' : 'Female'
        const is_organizer = faker.datatype.boolean()
        const tempCountry = locations[Math.floor(Math.random() * locations.length)]
        const tempCity = tempCountry.cities[Math.floor(Math.random() * tempCountry.cities.length)]
        const location = {
            country: tempCountry.name,
            city: tempCity
        }
        const date_of_birth = faker.date.birthdate({ min: 18, max: 65, mode: 'age' })
        const data = {
            _id,
            name,
            email,
            email_confirmed,
            phone,
            password,
            gender,
            is_organizer,
            location,
            date_of_birth
        }
        data1.push(data)
    }
    await createOrganizers(data1)
    return await User.insertMany(data1)
}

// Done
async function createOrganizers(users) {
    let data1 = []
    users.forEach(user => {
        if (user.is_organizer) {
            const user_id = user._id
            const rating = faker.number.int({ min: 0, max: 5 })
            const company_name = faker.company.name()
            const years_of_experience = faker.number.int({ min: 0, max: 20 })
            const num_of_trips = faker.number.int({ min: 0, max: 20 })
            const num_of_reports = 0
            const num_of_warnings = faker.number.int({ min: 0, max: 2 }) // need fix
            const proofs = {
                personal_id: faker.image.url(),
                personal_picture: faker.image.url(),
                work_id: faker.image.url(),
                last_certificate: faker.image.url(),
                companies_worked_for: faker.lorem.words(5).split(' ').map(word => faker.company.name()), // Generate company names
            };
            const data = {
                user_id,
                rating,
                company_name,
                years_of_experience,
                num_of_trips,
                num_of_reports,
                num_of_warnings,
                proofs
            }
            data1.push(data)
        }
    })
    return await Organizer.insertMany(data1)
}

// Done
async function createAnnouncementsApp(count = 1000) {
    let data1 = []
    for (let i = 0; i < count; i++) {
        const announcement_title = faker.word.words({ count: { min: 2, max: 4 } })
        const announcement_body = faker.word.words({ count: { min: 10, max: 40 } })
        const from_organizer = false
        const data = {
            announcement_title,
            announcement_body,
            from_organizer,
            location: 'Home'
        }
        data1.push(data)
    }
    return await Announcements.insertMany(data1)
}

// Done
async function createReportsApp(count = 750) {
    let data1 = []
    const randomCount = await User.countDocuments(); // Get total document count
    for (let i = 0; i < count; i++) {
        const randomSkip = Math.floor(Math.random() * randomCount); // Generate random skip value
        const user = await User.find().skip(randomSkip).limit(1);
        const user_id = user[0]._id
        const report_title = faker.word.words({ count: { min: 2, max: 4 } })
        const report_message = faker.word.words({ count: { min: 10, max: 40 } })
        const on_organizer = false
        const replied_to = faker.datatype.boolean()
        const data = {
            user_id,
            report_title,
            report_message,
            on_organizer,
            replied_to
        }
        data1.push(data)
    }
    return await Report.insertMany(data1)
}

// Done
async function createTrips(count = 1000, userID = null) {
    let data1 = [];
    const randomCount = await User.countDocuments();
    const promises = Array.from({ length: count }).map(async (val, i) => {
        const randomSkip = Math.floor(Math.random() * randomCount);
        const user = await User.find().skip(randomSkip).limit(1);
        let user_id = user[0]._id;
        if (userID) user_id = userID
        const num_of_people = faker.number.int({ min: 3, max: 15 });
        const is_shared = faker.datatype.boolean();
        const is_canceled = false;
        const { flights, overallPriceFlights } = await createOneWayFlightReservations(faker.number.int({ min: 2, max: 7 }), num_of_people, user_id);
        const { start_date, end_date, destinations, starting_place, places, hotelsIDs } = await createTripHelper(flights);
        const overall_num_of_days = Math.floor((end_date - start_date) / 1000 / 60 / 60 / 24);
        const { hotels, overallPrice } = await createHotelReservation(hotelsIDs, num_of_people, user_id);
        let overall_price = +overallPrice + +overallPriceFlights; // fix
        overall_price = overall_price.toFixed(2)
        const price_per_person = (overall_price / num_of_people).toFixed(2);
        const data = {
            user_id,
            start_date,
            end_date,
            destinations,
            flights,
            starting_place,
            num_of_people,
            is_shared,
            is_canceled,
            places_to_visit: places,
            overall_num_of_days,
            hotels,
            overall_price,
            price_per_person
        };
        data1.push(data);
    });

    await Promise.all(promises);
    return await Trip.insertMany(data1);
}

// Done
async function createTripHelper(plane_reservations) {
    let destinations = [] //
    let hotelsIDs = []
    let places = [] //
    let first_reservation = await PlaneReservation.findById(plane_reservations[0]);
    let first_flight = await Flight.findById(first_reservation.flights[0]._id)
    let start_date = first_flight.departure_date.dateTime
    let starting_place = {
        country: first_flight.source.country,
        city: first_flight.source.city,
    }
    let last_reservation = await PlaneReservation.findById(plane_reservations[plane_reservations.length - 1]);
    let last_flight = await Flight.findById(last_reservation.flights[0]._id)
    let end_date = last_flight.departure_date.dateTime // 

    for (let i = 0; i < plane_reservations.length; i++) {
        const temp = await PlaneReservation.findById(plane_reservations[i]);
        const flight = await Flight.findById(temp.flights[0]._id)
        const hotel = await getHotelInCity(flight.destination.city, flight.destination.country)
        hotelsIDs.push({ id: hotel._id, date: flight.arrival_date.dateTime })
        let num_of_days = 0;
        if (i < plane_reservations.length - 1) {
            const temp2 = await PlaneReservation.findById(plane_reservations[i + 1]);
            const flight2 = await Flight.findById(temp2.flights[0]._id)
            num_of_days = Math.floor((flight2.departure_date.dateTime - flight.arrival_date.dateTime) / 1000 / 60 / 60 / 24)
        }
        const allPlaces = await createPlacesWithDescription(flight.destination.city, flight.destination.country, num_of_days)
        places.push(...allPlaces.map(place => place.place))
        const destination = {
            country_name: flight.destination.country,
            city_name: flight.destination.city,
            num_of_days: num_of_days,
            activities: allPlaces
        }
        destinations.push(destination)
    }

    return { start_date, end_date, destinations, starting_place, places, hotelsIDs };
}

// Done
async function getHotelInCity(city_name, country_name) {
    let hotel = await Hotel.findOne({ 'room_types.available_rooms': { $gt: 0 }, 'location.city': city_name })
    if (!hotel) hotel = await Hotel.findOne({ 'room_types.available_rooms': { $gt: 0 }, 'location.country': country_name })
    if (!hotel) hotel = await Hotel.findOne({ 'room_types.available_rooms': { $gt: 0 }, })
    return hotel._id
}

//Done
async function createPlacesWithDescription(city_name, country_name, num_of_days) {
    let data = []
    const count = faker.number.int({ min: 3, max: 5 });
    let places = await Place.find({ 'address.city': city_name })
    if (places.length == 0) places = await Place.find({ 'address.country': country_name })
    if (places.length == 0) places = await Place.find()
    let placesCount = places.length
    if (num_of_days == 0) return []
    for (let i = 0; i < count; i++) {
        let day = faker.number.int({ min: 1, max: num_of_days });
        let place = places[faker.number.int({ min: 0, max: placesCount - 1 })]
        data.push({
            place: place._id,
            notifiable: false,
            day: day,
        })
    }
    return data
}

//Done
async function createOneWayFlightReservations(count, num_of_reservations1, userID) {
    let data1 = [];
    let overallPriceFlights = 0;
    let lastDepartureDate = new Date();
    let lastDestinationCountry;
    let sourceCountry;

    for (let i = 0; i <= count; i++) {
        const _id = faker.database.mongodbObjectId();
        const user_id = userID;
        const num_of_reservations = num_of_reservations1;

        let filter = { 'classes.available_seats': { $gt: num_of_reservations } };
        if (i > 0) {
            filter = { 'source.country': lastDestinationCountry, 'classes.available_seats': { $gt: num_of_reservations } };
        }
        if (i == count) {
            lastDestinationCountry = sourceCountry;
            filter = { 'source.country': sourceCountry, 'classes.available_seats': { $gt: num_of_reservations } };
        }

        const randomCountFlight = await Flight.countDocuments(filter);
        const randomSkip = Math.max(Math.floor(Math.random() * randomCountFlight) - 1, 0);

        let flights = await Flight.find(filter).skip(randomSkip).limit(1);
        if (!flights || !flights[0] || flights[0].departure_date.dateTime < lastDepartureDate) {
            flights = await createFlights(1, lastDestinationCountry, lastDepartureDate);
        }

        lastDepartureDate = flights[0].arrival_date.dateTime;
        lastDestinationCountry = flights[0].destination.country;
        if (i == 0) sourceCountry = flights[0].source.country;

        const { temp, overall_price } = await createReservationData(num_of_reservations, flights[0]._id);
        overallPriceFlights += +overall_price.toFixed(2);
        const reservations = { data: temp, overall_price: +overall_price.toFixed(2) };
        const reservation_type = 'One-Way';
        const is_confirmed = true;
        const data = {
            _id,
            user_id,
            flights: [flights[0]._id],
            num_of_reservations,
            reservations,
            reservation_type,
            is_confirmed,
            overall_price: overall_price.toFixed(2)
        };
        data1.push(data);
    }
    if (sourceCountry) {
        const _id = faker.database.mongodbObjectId();
        const user_id = userID;
        const num_of_reservations = num_of_reservations1;
        let filter = {
            'source.country': lastDestinationCountry,
            'destination.country': sourceCountry,
            'classes.available_seats': { $gt: num_of_reservations },
            'departure_date.dateTime': { $gt: lastDepartureDate }
        };

        const randomCountFlight = await Flight.countDocuments(filter);
        const randomSkip = Math.max(Math.floor(Math.random() * randomCountFlight) - 1, 0);

        let returnFlights = await Flight.find(filter).skip(randomSkip).limit(1);
        if (!returnFlights || !returnFlights[0]) {
            returnFlights = await createFlights(1, lastDestinationCountry, lastDepartureDate, sourceCountry);
        }

        const { temp, overall_price } = await createReservationData(num_of_reservations, returnFlights[0]._id);
        overallPriceFlights += +overall_price.toFixed(2);
        const reservations = { data: temp, overall_price: +overall_price.toFixed(2) };
        const reservation_type = 'One-Way';
        const is_confirmed = true;
        const returnData = {
            _id,
            user_id,
            flights: [returnFlights[0]._id],
            num_of_reservations,
            reservations,
            reservation_type,
            is_confirmed,
            overall_price: overall_price.toFixed(2)
        };
        data1.push(returnData);
    }
    await PlaneReservation.insertMany(data1);
    return { flights: data1.map(data2 => data2._id), overallPriceFlights };
}

//Done
async function createReservationData(num_of_reservations, flightId) {
    const flight = await Flight.findById(flightId);
    let temp = [];
    let classPlane = faker.helpers.arrayElement(flight.classes);
    while (classPlane.available_seats < num_of_reservations && classPlane == 0) {
        classPlane = faker.helpers.arrayElement(flight.classes);
    }

    for (let i = 0; i < num_of_reservations; i++) {
        temp.push({
            person_name: faker.person.fullName(),
            seat_class: classPlane.code,
            person_passport: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
            seat_number: `${classPlane.code}${classPlane.available_seats}`,
            price: classPlane.price,
        });
        classPlane.available_seats--;
    }

    const overallPrice = temp.reduce((total, passenger) => total + passenger.price, 0);

    classPlane.available_seats = flight.classes.find(cls => cls.code === classPlane.code).available_seats - num_of_reservations;

    await Flight.updateOne(
        { _id: flightId, "classes.code": classPlane.code },
        { $set: { "classes.$.available_seats": classPlane.available_seats } }
    );
    await Flight.findByIdAndUpdate(flightId, { available_seats: flight.available_seats - num_of_reservations })

    return {
        temp,
        overall_price: overallPrice,
    };
}

// Done
async function createHotelReservation(hotels, num_of_people, userID) {
    let data1 = []
    let overallPrice = 0;
    for (let i = 0; i < hotels.length; i++) {
        const _id = faker.database.mongodbObjectId()
        const user_id = userID
        const hotel_id = hotels[i].id
        const start_date = new Date(hotels[i].date)
        let end_date = new Date(hotels[i].date)
        end_date.setDate(start_date.getDate() + 1);
        const { rooms, overall_price } = await createRoomCodes(hotel_id, num_of_people)
        overallPrice += +overall_price.toFixed(2)
        const room_codes = rooms
        const room_price = +overall_price.toFixed(2)
        const data = {
            _id,
            hotel_id,
            user_id,
            start_date,
            end_date,
            room_codes,
            room_price
        }
        data1.push(data)
    }
    await HotelReservation.insertMany(data1)
    return { hotels: data1.map(data => data._id), overallPrice }
}

// Done
async function createRoomCodes(hotel_id, num_of_people) {
    const hotel = await Hotel.findById(hotel_id);
    const room_types = hotel.room_types
    let rooms = []
    let overall_price = 0
    const room = faker.helpers.arrayElement(room_types)
    while (room.available_rooms <= num_of_people) {
        room = faker.helpers.arrayElement(room_types)
    }
    const temp = {
        code: room.code,
        count: num_of_people,
        price: room.price,
        overall_price: room.price * num_of_people
    }
    room.available_rooms -= num_of_people
    overall_price += temp.overall_price
    rooms.push(temp)
    await Hotel.updateOne(
        { _id: hotel_id, "room_types.code": room.code },
        { $set: { "room_types.$.available_seats": room.available_rooms } }
    );
    return { rooms, overall_price }
}

// Done
async function createOrganizedTrips() {
    let data1 = []
    const organizers = await User.find({ is_organizer: true });
    const promises = organizers.map(async organizer => {
        const trips = await Trip.find({ user_id: organizer._id });
        const organizerData = await Organizer.findOne({ user_id: organizer._id })
        if (trips.length > 0) {
            trips.forEach(async trip => {
                const trip_id = trip._id
                const overall_seats = trip.num_of_people
                const available_seats = 0 // fix
                const commission = faker.number.int({ min: 0, max: 10000 })
                let price = trip.price_per_person + commission
                price = price.toFixed(2)
                const type_of_trip = faker.helpers.arrayElements(["Entertainment", "Exploratory", "Therapeutic", "Artistic", "Educational"])
                const description = faker.lorem.sentence()
                const data = {
                    organizer_id: organizerData._id,
                    trip_id,
                    overall_seats,
                    available_seats,
                    commission,
                    price,
                    type_of_trip,
                    description
                }
                data1.push(data)
            })
            await Organizer.findByIdAndUpdate(organizer._id, { $inc: { num_of_trips: 1 } });
        }
    })
    await Promise.all(promises);
    return await OrganizedTrip.insertMany(data1)
}

// Done
function createPhoneNumber() {
    const countryNumber = numbers[Math.floor(Math.random() * numbers.length)]
    let length = countryNumber.phone_length
    if (length == undefined) length = countryNumber.min
    else if (length.length != undefined) length = length[0]
    return number = {
        country_code: countryNumber.phone,
        number: faker.string.numeric(length)
    }
}

// Done
async function createReportsOrganizers(count = 750) {
    let data1 = []
    const randomCountOrganizers = await User.countDocuments({ is_organizer: true });
    const randomCountUser = await User.countDocuments({ is_organizer: false });
    for (let i = 0; i < count; i++) {
        const randomSkip = Math.floor(Math.random() * randomCountUser); // Generate random skip value
        const user = await User.find().skip(randomSkip).limit(1);
        const user_id = user[0]._id
        const report_title = faker.word.words({ count: { min: 2, max: 4 } })
        const report_message = faker.word.words({ count: { min: 10, max: 40 } })
        const on_organizer = true
        const replied_to = faker.datatype.boolean()

        const randomSkipOrganizer = Math.floor(Math.random() * randomCountOrganizers); // Generate random skip value
        let organizer = await Organizer.find().skip(randomSkipOrganizer).limit(1);
        const organizer_id = organizer[0]._id
        await Organizer.findByIdAndUpdate(organizer_id, { $inc: { num_of_reports: 1 } });
        const data = {
            user_id,
            report_title,
            report_message,
            on_organizer,
            replied_to,
            organizer_id
        }
        data1.push(data)
    }
    return await Report.insertMany(data1)
}

// Done
async function createAnnouncementsRequests() {
    let data1 = [];
    const organizedTrips = await OrganizedTrip.find();

    const promises = organizedTrips.map(async organizedTrip => {
        const announcement_title = faker.word.words({ count: { min: 2, max: 4 } });
        const announcement_body = faker.word.words({ count: { min: 10, max: 40 } });
        const trip = await Trip.findById(organizedTrip.trip_id);
        const user_id = trip.user_id;
        const organizer_id = await Organizer.findOne({ user_id: user_id });
        const organized_trip_id = organizedTrip._id;
        const rand = Math.random();
        const num_of_days = faker.helpers.arrayElement([1, 3, 7, -1]);
        const location = faker.helpers.arrayElement(["Home", "Organized"]);
        const price = faker.number.int({ min: 100, max: 2000 })

        let is_accepted;
        let data;
        if (rand < 0.33) {
            is_accepted = true;
            data = {
                announcement_title,
                announcement_body,
                organizer_id,
                organized_trip_id,
                is_accepted,
                num_of_days,
                location,
                price
            };
        } else if (rand < 0.66) {
            is_accepted = false;
            data = {
                announcement_title,
                announcement_body,
                organizer_id,
                organized_trip_id,
                is_accepted,
                num_of_days,
                location,
                price
            };
        } else {
            data = {
                announcement_title,
                announcement_body,
                organizer_id,
                organized_trip_id,
                num_of_days,
                location,
                price
            };
        }
        return data;
    });

    data1 = await Promise.all(promises);

    return await AnnouncementRequest.insertMany(data1);
}

function calculatePriceForAnnouncement(num_of_days, location, trip) {
    const homePageMultiplier = 1.5;
    const endingOfAnnouncement = Math.floor((trip.start_date - new Date()) / 1000 / 60 / 60 / 24)
    const oneDay = 200
    const threeDays = 550
    const oneWeek = 1150
    const tillTheStartOfTheTrip = Math.floor(endingOfAnnouncement * oneDay - endingOfAnnouncement * (oneDay / 1.5))
    if (location == 'Home') {
        if (num_of_days == 1) return oneDay * homePageMultiplier
        if (num_of_days == 3) return threeDays * homePageMultiplier
        if (num_of_days == 7) return oneWeek * homePageMultiplier
        if (num_of_days == -1) return tillTheStartOfTheTrip * homePageMultiplier
    } else {
        if (num_of_days == 1) return oneDay
        if (num_of_days == 3) return threeDays
        if (num_of_days == 7) return oneWeek
        if (num_of_days == -1) return tillTheStartOfTheTrip
    }
}

function expiryDateHelper(trip, num_of_days) {
    let expiry_date = new Date();
    expiry_date.setUTCDate(expiry_date.getUTCDate() + num_of_days)
    return num_of_days == -1 ?
        Math.floor((trip.start_date - new Date()) / 1000 / 60 / 60 / 24) :
        expiry_date
}

// Done
async function createAnnouncementsOrganizer() {
    let data1 = []
    const announcementRequests = await AnnouncementRequest.find({ is_accepted: true })
    await Promise.all(announcementRequests.map(async (request) => {
        const announcement_title = request.announcement_title;
        const announcement_body = request.announcement_body;
        const from_organizer = true;
        const organized_trip_id = request.organized_trip_id;
        const organizer_id = request.organizer_id;
        const organized_trip = await OrganizedTrip.findById(organized_trip_id);
        const trip = await Trip.findById(organized_trip.trip_id);
        const expiry_date = expiryDateHelper(trip, request.num_of_days);
        const location = request.location;
        const price = calculatePriceForAnnouncement(request.num_of_days, request.location, trip);

        const data = {
            announcement_title,
            announcement_body,
            from_organizer,
            organized_trip_id,
            organizer_id,
            expiry_date,
            location,
            price,
        };

        data1.push(data);
    }));

    return await Announcements.insertMany(data1)
}

async function createOrganizersRequests() {
    let data1 = []
    const organizers = await Organizer.find();
    organizers.forEach(organizer => {
        const user_id = organizer.user_id
        const company_name = organizer.company_name
        const years_of_experience = organizer.years_of_experience
        const proofs = organizer.proofs
        const data = {
            user_id,
            company_name,
            years_of_experience,
            proofs,
            is_accepted: true
        }
        data1.push(data)
    })
    await OrganizerRequest.insertMany(data1)
}

// organized trip reservation
async function createOrganizedTripReservations() {
    let data1 = []
    const organizedTrips = await OrganizedTrip.find();
    const randomCount = await User.countDocuments({ is_organizer: false });
    for (const organizedTrip of organizedTrips) {
        const randomSkip = Math.floor(Math.random() * randomCount);
        const user = await User.find({ is_organizer: false }).skip(randomSkip).limit(1);
        const user_id = user[0]._id

        const trip_id = organizedTrip._id

        const overall_seats = organizedTrip.overall_seats
        const price_per_person = organizedTrip.price

        const num_of_people = faker.number.int({ min: 0, max: overall_seats })
        let overall_price = num_of_people * price_per_person
        overall_price = overall_price.toFixed(2)
        const reservation_data = createOrganizedTripReservationDataHelper(num_of_people, price_per_person)
        if (reservation_data.length == 0) continue;
        await updatePlaneReservations(organizedTrip.trip_id, reservation_data)
        await updateOrganizedTripData(organizedTrip._id, overall_seats, num_of_people)
        const data = {
            user_id,
            trip_id,
            overall_price,
            num_of_people,
            reservation_data,
        }
        data1.push(data)
    }

    return await OrganizedTripReservation.insertMany(data1)
}

function createOrganizedTripReservationDataHelper(num_of_reservations, price) {
    let temp = []
    for (let i = 0; i < num_of_reservations; i++) {
        temp.push({
            name: faker.person.fullName(),
            passport_number: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
            price: price,
        });
    }
    return temp;
}

async function updatePlaneReservations(organizedTrip_tripID, reservation_data) {
    const trip = await Trip.findById(organizedTrip_tripID);
    const plane_reservations = trip.flights;

    for (let plane_reservation of plane_reservations) {
        const temp = await PlaneReservation.findById(plane_reservation);
        let i = 0;
        let tempData = []
        const temp2 = temp.reservations.data
        for (const aa of temp2) {
            if (reservation_data[i]) {
                aa.person_name = reservation_data[i].name;
                aa.person_passport = reservation_data[i].passport_number;
            } else {
                aa.person_name = "Default";
            }
            i++;
            tempData.push(aa)
        }
        await PlaneReservation.findByIdAndUpdate(plane_reservation, { 'reservations.data': tempData });
    }
}

async function updateOrganizedTripData(organizedTripID, overall_seats, num_of_people) {
    const available_seats = overall_seats - num_of_people;
    await OrganizedTrip.findByIdAndUpdate(organizedTripID, { available_seats })
}

async function createOrganizersRequestsNotAccepted() {
    let data1 = []
    const users = await User.find({ is_organizer: false }).limit(350);
    users.forEach(user => {
        const user_id = user._id
        const company_name = faker.company.name()
        const years_of_experience = faker.number.int({ min: 0, max: 20 })
        const proofs = {
            personal_id: faker.image.url(),
            personal_picture: faker.image.url(),
            work_id: faker.image.url(),
            last_certificate: faker.image.url(),
            companies_worked_for: faker.lorem.words(5).split(' ').map(word => faker.company.name()),
        };
        const data = {
            user_id,
            company_name,
            years_of_experience,
            proofs
        }
        data1.push(data)
    })
    await OrganizerRequest.insertMany(data1)
}

function assignColorToUser(users_id) {
    let data = []
    users_id.forEach(user => {
        const temp = {
            id: user,
            color: faker.color.rgb({ prefix: '0xff' })
        }
        data.push(temp)
    })
    return data
}

function getUsersID(reservations, organizer_id) {
    let temp = reservations.map(reservation => reservation.user_id)
    temp.push(organizer_id)
    return temp
}

async function createChats() {
    let data = []
    const organized_trips = await OrganizedTrip.find();
    for (const trip of organized_trips) {
        let organizer_id = trip.organizer_id
        let trip_id = trip._id
        let name = faker.company.buzzVerb() + ' Trip'
        let reservations = await OrganizedTripReservation.find({ trip_id: trip_id })
        let organizer = await Organizer.findOne(organizer_id)
        let organizer_user_id = organizer.user_id
        let users_id = getUsersID(reservations, organizer_user_id)
        users_id = assignColorToUser(users_id)
        let temp = {
            organizer_id,
            trip_id,
            users_id,
            name,
            messages: []
        }
        data.push(temp)
    }
    await Chat.insertMany(data)
}

async function createNotifications() {
    let data = []
    for (let i = 0; i < 3000; i++) {
        const temp = {
            notification_title: faker.word.words({ count: { min: 2, max: 4 } }),
            notification_body: faker.lorem.lines({ min: 1, max: 3 }),
            is_global: true,
            createdAt: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2024-08-14T00:00:00.000Z' })
        }
        data.push(temp)
    }
    await Notification.insertMany(data)
}

module.exports = {
    createUsers,
    createAnnouncementsApp,
    createReportsApp,
    createTrips,
    createOrganizedTrips,
    createReportsOrganizers,
    createAnnouncementsRequests,
    createAnnouncementsOrganizer,
    createOrganizersRequests,
    createOrganizedTripReservations,
    createOrganizersRequestsNotAccepted,
    createChats,
    createNotifications
}