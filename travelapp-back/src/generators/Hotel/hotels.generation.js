const fs = require('fs')
const { faker } = require('@faker-js/faker')
const hotelData = require('./hotelData2.json')
const roomData = require('./roomData.json')
const descriptions = require('./descriptions.json')
const location = require('./countries-all.json')
const hotels = require('./hotels.json')
const hotels2 = require('./hotels2.json')
const tags = require('./tags.json')

function createHotels() {
    let hotels = [];
    let room_types = []
    const num_type_rooms = Math.floor(Math.random() * 10)
    for (let i = 0; i < num_type_rooms; i++) {
        room_types.push(roomData[Math.floor(Math.random() * roomData.length)])
    }
    hotelData.forEach(data => {
        const temp = {
            name: data.name,
            location: {
                country: data.country,
                city: data.city ?? faker.location.city(),
                address: data.address ?? faker.location.streetAddress()
            },
            overview: data.overview,
            stars: data.stars,
            room_types: room_types
        }
        hotels.push(temp)
    })
    fs.writeFileSync('hotels.final.json', JSON.stringify(hotels))
}

function hotels1Gen() {
    let temp = [];
    hotels.forEach(hotel => {
        let obj = {
            name: hotel.hotel_name,
            city: hotel.city,
            country: hotel.country,
            address: hotel.addressline1,
            overview: hotel.overview,
            stars: hotel.star_rating
        }
        temp.push(obj);
    })
    fs.writeFileSync('hotelData.json', JSON.stringify(temp))
}

function hotels2Gen() {
    let temp = [];
    hotels2.forEach(hotel => {
        const tempCountry = location[Math.floor(Math.random() * location.length)]
        const tempCity = tempCountry.cities[Math.floor(Math.random() * tempCountry.cities.length)]
        let obj = {
            name: hotel.name,
            city: tempCity,
            country: tempCountry.name,
            address: hotel.address ?? hotel.directions,
            overview: hotel.content,
            stars: Math.floor(Math.random() * 5) + 1
        }
        temp.push(obj);
    })
    fs.writeFileSync('hotelData2.json', JSON.stringify(temp))
}

function tag1s() {
    let temp = [];
    rooms.forEach(room => {
        let tagz = [];
        const ran = Math.floor(Math.random() * 4)
        for (let i = 0; i < ran; i++) tagz.push(tags[Math.floor(Math.random() * tags.length)])
        let obj = {
            description: room.Description,
            price: room.BaseRate,
            bed_options: room.BedOptions,
            sleeps_count: room.SleepsCount,
            smmoking_allowed: room.SmokingAllowed,
            tags: tagz,
        }
        temp.push(obj)
    })
    fs.writeFileSync('roomData.json', JSON.stringify(temp))

}

createHotels()
// hotels1Gen();
// hotels2Gen();
// tag1s();