const fs = require('fs')
const { faker } = require('@faker-js/faker')
const restaurants = require('./restaurants(final).json')
const location = require('./countries-all.json')
const numbers = require('../../public/json/phone_number.json')
const stadiums = require('./stadiums(final).json')
const musuems = require('./traverler_rating_world.json')

function createRestaurants() {
    let data = []
    restaurants.forEach(rest => {
        const tempCountry = location[Math.floor(Math.random() * location.length)]
        const tempCity = tempCountry.cities[Math.floor(Math.random() * tempCountry.cities.length)]
        const address = {
            country: tempCountry.name,
            city: tempCity,
            address: faker.location.streetAddress()
        }
        const temp = {
            name: rest.name,
            phone_number: rest.phone_number,
            category: "Restaurant",
            address: address,
            // work_time:  // Fix
            description: rest.category,
        }
        data.push(temp)
    })
    fs.writeFileSync('restaurants.json', JSON.stringify(data))

}

function getNames() {
    let data = []
    data = Object.keys(musuems)
    fs.writeFileSync('musuem-names.json', JSON.stringify(data))
}

function createStadiums() {
    let data = []
    stadiums.forEach(stad => {
        const address = {
            country: stad.country,
            city: stad.city,
            address: faker.location.streetAddress()
        }
        const countryNumber = numbers[Math.floor(Math.random() * numbers.length)]
        let length = countryNumber.phone_length
        if (length == undefined) length = countryNumber.min
        else if (length.length != undefined) length = length[0]
        const number = {
            country_code: countryNumber.phone,
            number: faker.string.numeric(length)
        }
        const temp = {
            name: stad.name,
            phone_number: number,
            category: "Stadium",
            address: address,
            // work_time:  // Fix
            description: faker.lorem.word(),
        }
        data.push(temp)
    })
    fs.writeFileSync('stadiums.json', JSON.stringify(data))
}


getNames()
// createRestaurants();
// createStadiums();