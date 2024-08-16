// const fs = require('fs')
// const { faker } = require('@faker-js/faker')
// const hotelData = require('../../public/json/hotelData.json')
// const roomData = require('../../public/json/roomData.json')
// const hotelsMongo = require('../../models/hotels.mongo')

// async function createHotels() {
//     let hotels = [];
//     hotelData.forEach(data => {
//         let room_types = []
//         let overall_rooms = 0;
//         const num_type_rooms = Math.floor(Math.random() * 10) + 3
//         for (let i = 0; i < num_type_rooms; i++) {
//             const room = roomData[Math.floor(Math.random() * roomData.length)]
//             room.available_rooms = Math.floor(Math.random() * 300) + 100;
//             room_types.push(room)
//             overall_rooms += room.available_rooms
//         }
//         const temp = {
//             name: data.name,
//             location: {
//                 country: data.country,
//                 city: data.city ?? faker.location.city(),
//                 name: data.address ?? faker.location.streetAddress()
//             },
//             description: data.overview,
//             stars: data.stars,
//             room_types: room_types,
//             rooms_number: overall_rooms
//         }
//         hotels.push(temp)
//     })
//     // fs.writeFileSync('hotels.final.json', JSON.stringify(hotels))
//     return await hotelsMongo.insertMany(hotels)
// }

// module.exports = createHotels;


const fs = require('fs');
const { faker } = require('@faker-js/faker');
const hotelData = require('../public/json/hotelData.json');
const Hotel = require('../models/hotels.mongo');
let hotelImages = require('../public/json/hotelImages.json')
let roomImages = require('../public/json/roomImages.json')
let locations = require('../public/json/countries-all.json')

const roomCategories = [
    { type: 'Budget Room', priceMultiplier: 0.5, amenities: ['Free WiFi'], roomCountOptions: [50, 100, 150, 200] },
    { type: 'Standard Room', priceMultiplier: 1, amenities: ['Free WiFi', 'TV'], roomCountOptions: [100, 150, 200, 250] },
    { type: 'Deluxe Room', priceMultiplier: 1.5, amenities: ['Free WiFi', 'TV', 'Mini Bar'], roomCountOptions: [75, 125, 175, 225] },
    { type: 'Suite', priceMultiplier: 2, amenities: ['Free WiFi', 'TV', 'Mini Bar', 'Room Service'], roomCountOptions: [60, 110, 160, 210] }
];

function createRoomTypes() {
    let roomTypes = [];
    const viewOptions = ['Sea View', 'City View', 'Garden View'];
    const bedOptions = ['Single Bed', 'Double Bed', 'King Size Bed', 'Queen Size Bed'];

    roomCategories.forEach((category, index) => {
        const numberOfSubTypes = faker.number.int({ min: 1, max: 3 });
        const roomCount = faker.helpers.arrayElement(category.roomCountOptions);

        for (let i = 0; i < numberOfSubTypes; i++) {
            const code = String.fromCharCode(65 + index) + (i + 1);
            const totalRooms = roomCount;

            roomTypes.push({
                code: code,
                type: category.type.split(' ')[0],
                description: `${category.type} with well-furnished, spacious rooms.`,
                price: parseFloat((Math.random() * 100 + 100 * category.priceMultiplier).toFixed(2)),
                bed_options: faker.helpers.arrayElement(bedOptions),
                bed_options_count: faker.number.int({ min: 1, max: 4 }),
                sleeps_count: faker.number.int({ min: 1, max: 4 }),
                smoking_allowed: faker.datatype.boolean(),
                available_rooms: totalRooms,
                total_rooms: totalRooms,
                view: faker.helpers.arrayElement(viewOptions),
                amenities: category.amenities,
                images: getRoomImages()
            });
        }
    });

    return roomTypes;
}

function getHotelImages() {
    const images = new Set();
    while (images.size < 5) {
        const randomIndex = Math.floor(Math.random() * hotelImages.length);
        images.add('images/hotels/' + hotelImages[randomIndex]);
    }
    return Array.from(images);
}

function getRoomImages() {
    const images = new Set();
    while (images.size < 3) {
        const randomIndex = Math.floor(Math.random() * roomImages.length);
        images.add('images/rooms/' + roomImages[randomIndex]);
    }
    return Array.from(images);
}

async function createHotels(count) {
    let hotels = [];
    hotelData.forEach(data => {
        const room_types = createRoomTypes();
        const overall_rooms = room_types.reduce((sum, type) => sum + type.available_rooms, 0);
        let distanceFromCityCenter = ((Math.random() * 4) + 1).toFixed(2);

        let location = locations.find(country => country.name == data.country)
        if (!location) {
            location = locations[Math.floor(Math.random() * locations.length)]
        }
        let city = location?.cities[Math.floor(Math.random() * location.cities.length)];

        const hotel = {
            name: data.name,
            location: {
                country: location.name,
                city: city,
                name: data.address ?? faker.location.streetAddress(),
            },
            description: data.overview,
            stars: Math.floor(data.stars),
            room_types: room_types,
            rooms_number: overall_rooms,
            distance_from_city_center: distanceFromCityCenter,
            images: getHotelImages()
        };
        hotels.push(hotel);
    });
    for (let i = 0; i < count; i++) {
        const room_types = createRoomTypes();
        const overall_rooms = room_types.reduce((sum, type) => sum + type.available_rooms, 0);
        let distanceFromCityCenter = ((Math.random() * 4) + 1).toFixed(2);

        const location = locations[Math.floor(Math.random() * locations.length)]
        let city;
        if (location.cities.length == 0) city = faker.location.city();
        else city = location?.cities[Math.floor(Math.random() * location.cities.length)];

        const hotel = {
            name: faker.company.name() + ' Hotel',
            location: {
                country: location.name,
                city: city,
                name: faker.location.streetAddress(),
            },
            description: faker.lorem.sentence(),
            stars: faker.number.int({ min: 1, max: 5 }),
            room_types: room_types,
            rooms_number: overall_rooms,
            distance_from_city_center: distanceFromCityCenter,
            images: getHotelImages()
        };
        hotels.push(hotel);
    }

    try {
        const createdHotels = await Hotel.insertMany(hotels);
        console.log(`${createdHotels.length} hotels were successfully created.`);
        return createdHotels;
    } catch (error) {
        console.error("Failed to create hotels:", error);
        throw error;
    }
}

module.exports = createHotels;
