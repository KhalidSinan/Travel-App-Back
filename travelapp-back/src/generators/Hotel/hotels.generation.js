const fs = require('fs')
const { faker } = require('@faker-js/faker')
const hotelData = require('../../public/json/hotelData.json')
const roomData = require('../../public/json/roomData.json')
const hotelsMongo = require('../../models/hotels.mongo')

async function createHotels() {
    let hotels = [];
    hotelData.forEach(data => {
        let room_types = []
        let overall_rooms = 0;
        const num_type_rooms = Math.floor(Math.random() * 10) + 3
        for (let i = 0; i < num_type_rooms; i++) {
            const room = roomData[Math.floor(Math.random() * roomData.length)]
            room.available_rooms = Math.floor(Math.random() * 300) + 100;
            room_types.push(room)
            overall_rooms += room.available_rooms
        }
        const temp = {
            name: data.name,
            location: {
                country: data.country,
                city: data.city ?? faker.location.city(),
                address: data.address ?? faker.location.streetAddress()
            },
            description: data.overview,
            stars: data.stars,
            room_types: room_types,
            rooms_number: overall_rooms
        }
        hotels.push(temp)
    })
    // fs.writeFileSync('hotels.final.json', JSON.stringify(hotels))
    return await hotelsMongo.insertMany(hotels)
}

module.exports = createHotels;