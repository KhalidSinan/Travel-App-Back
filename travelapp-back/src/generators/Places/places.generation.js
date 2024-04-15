const fs = require('fs')
const { faker } = require('@faker-js/faker')
const restaurants = require('./restaurants.json')
const location = require('./country-by-cities.json')


function createRestaurants() {
    let data = []
    restaurants.forEach(rest => {
        const tempCountry = location[Math.floor(Math.random() * location.length)]
        const tempCity = tempCountry.cities[Math.floor(Math.random() * tempCountry.cities.length)]
        const address = {
            country: tempCountry.country,
            city: tempCity,
            address: faker.location.streetAddress()
        }
        const temp = {
            name: rest.name,
            phone_number: rest.contact.phone,
            category: rest.categories,
            address: address,
            // work_time:  // Fix
            description: faker.lorem.word
        }
        data.push(temp)
    })
    fs.writeFileSync('restaurants.json', JSON.stringify(data))

}

createRestaurants();