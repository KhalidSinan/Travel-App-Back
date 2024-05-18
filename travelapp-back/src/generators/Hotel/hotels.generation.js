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
const hotelData = require('../../public/json/hotelData.json');
const Hotel = require('../../models/hotels.mongo');

const roomCategories = [
    { type: 'Budget Room', priceMultiplier: 0.5, amenities: ['Free WiFi'] },
    { type: 'Standard Room', priceMultiplier: 1, amenities: ['Free WiFi', 'TV'] },
    { type: 'Deluxe Room', priceMultiplier: 1.5, amenities: ['Free WiFi', 'TV', 'Mini Bar'] },
    { type: 'Suite', priceMultiplier: 2, amenities: ['Free WiFi', 'TV', 'Mini Bar', 'Room Service'] }
];

function createRoomTypes() {
    return roomCategories.map((category, index) => {
        const code = String.fromCharCode(65 + index);
        const totalRooms = faker.datatype.number({ min: 50, max: 100 });

        return {
            code: code,
            description: `${category.type} with well furnished, spacious rooms.`,
            price: parseFloat((Math.random() * 100 + 100 * category.priceMultiplier).toFixed(2)),
            bed_options: faker.helpers.arrayElement(['Single Bed', 'Double Bed', 'King Size Bed']),
            sleeps_count: faker.datatype.number({ min: 1, max: 4 }),
            smoking_allowed: faker.datatype.boolean(),
            available_rooms: totalRooms,
            total_rooms: totalRooms,
            amenities: category.amenities,
        };
    });
}


async function createHotels() {
    let hotels = [];
    hotelData.forEach(data => {
        const room_types = createRoomTypes();
        const overall_rooms = room_types.reduce((sum, type) => sum + type.available_rooms, 0);

        const hotel = {
            name: data.name,
            location: {
                country: data.country,
                city: data.city ?? faker.address.city(),
                name: data.address ?? faker.address.streetAddress(),
            },
            description: data.overview,
            stars: data.stars,
            room_types: room_types,
            rooms_number: overall_rooms
        };
        hotels.push(hotel);
    });

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
