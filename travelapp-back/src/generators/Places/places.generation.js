const fs = require('fs')
const { faker } = require('@faker-js/faker')
const restaurants = require('./restaurants(final).json')
const location = require('./countries-all.json')
// const stadiums = require('./SoccerStadiums.json')
const musuems = require('./tag_clouds_world.json')


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
    // fs.writeFileSync('musuem-names.json', JSON.stringify(data))
}

function createStadiums() {
    let data = []
    stadiums.forEach(stad => {
        const address = {
            country: stad.Nation,
            city: stad.Town,
            address: faker.location.streetAddress()
        }
        const temp = {
            name: stad.Name,
            phone_number: faker.phone.number(),
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