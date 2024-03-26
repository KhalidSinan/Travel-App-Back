const hotelData = require('./hotelData.json')
const rooms = require('./rooms.json')
const descriptions = require('./descriptions.json')
const location = require('./country-by-cities.json')
const hotels = require('./hotels.json')
const fs = require('fs')

function createHotels() {
    let hotels = [];
    let room_types = []
    // const tempCountry = location[Math.floor(Math.random() * (location.length))]
    // const tempCity = tempCountry.cities[Math.floor(Math.random() * (tempCountry.cities.length))]
    const num_type_rooms = Math.floor(Math.random() * 10)
    for (let i = 0; i < num_type_rooms; i++) {
        room_types.push(rooms[Math.floor(Math.random() * rooms.length)])
    }
    hotelData.forEach(data => {
        const temp = {
            name: data.name,
            location: {
                country: data.country,
                city: data.city,
                address: data.address
            },
            overview: data.overview,
            stars: data.stars,
            room_types: room_types
        }
        hotels.push(temp)
    })
    fs.writeFileSync('hotels.final.json', JSON.stringify(hotels))
}

// function ss() {
//     let temp = [];
//     hotels.forEach(hotel => {
//         let obj = {
//             name: hotel.name,
//             city: hotel.city,
//             country: hotel.country,
//             address: hotel.addressline1,
//             overview: hotel.overview,
//             stars: hotel.star_rating
//         }
//         temp.push(obj);
//     })
//     fs.writeFileSync('hotelData.json', JSON.stringify(temp))
// }

createHotels()
// ss();