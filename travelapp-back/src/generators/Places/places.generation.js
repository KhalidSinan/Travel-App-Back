const fs = require('fs')
const { faker } = require('@faker-js/faker')
const restaurants = require('../../public/json/restaurants(final).json')
const location = require('../../public/json/countries-all.json')
const numbers = require('../../public/json/phone_number.json')
const stadiums = require('../../public/json/stadiums(final).json')
const musuems = require('../../public/json/musuem-names.json')
const poi = require('../../public/json/poi-names.json')
const placesMongo = require('../../models/places.mongo')

function createRestaurants() {
    let data = []
    restaurants.forEach(rest => {
        const tempCountry = location[Math.floor(Math.random() * location.length)]
        const tempCity = tempCountry.cities[Math.floor(Math.random() * tempCountry.cities.length)]
        const address = {
            country: tempCountry.name,
            city: tempCity ?? faker.location.city(),
            address: faker.location.streetAddress()
        }
        const phone_number = createPhoneNumber()
        const temp = {
            name: rest.name,
            phone_number: phone_number,
            category: "Food",
            address: address,
            // work_time:  // Fix
            description: rest.category,
        }
        data.push(temp)
    })
    // fs.writeFileSync('restaurants.json', JSON.stringify(data))
    return data;
}

function getNames() {
    let data = []
    data = Object.keys(musuems)
    fs.writeFileSync('musuem-names.json', JSON.stringify(data))
}

function createStadiums() {
    let data = []
    stadiums.forEach(stad => {
        const tempCountry = location[Math.floor(Math.random() * location.length)]
        const tempCity = tempCountry.cities[Math.floor(Math.random() * tempCountry.cities.length)]
        const address = {
            country: tempCountry.name,
            city: tempCity ?? faker.location.city(),
            address: faker.location.streetAddress()
        }
        const number = createPhoneNumber()
        const temp = {
            name: stad.name,
            phone_number: number,
            category: "Sports",
            address: address,
            // work_time:  // Fix
            description: faker.lorem.word(),
        }
        data.push(temp)
    })
    // fs.writeFileSync('stadiums.json', JSON.stringify(data))
    return data;
}

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

function createMusuems() {
    let data = []
    musuems.forEach(musuem => {
        const tempCountry = location[Math.floor(Math.random() * location.length)]
        const tempCity = tempCountry.cities[Math.floor(Math.random() * tempCountry.cities.length)]
        const address = {
            country: tempCountry.name,
            city: tempCity ?? faker.location.city(),
            address: faker.location.streetAddress()
        }
        const phone_number = createPhoneNumber()
        const temp = {
            name: musuem,
            phone_number: phone_number,
            category: "Arts & History",
            address: address,
            // work_time:  // Fix
            description: faker.word.noun(),
        }
        data.push(temp)
    })
    // fs.writeFileSync('restaurants.json', JSON.stringify(data))
    return data;
}

function createAdventure() {
    let data = []
    poi.forEach(place => {
        const tempCountry = location[Math.floor(Math.random() * location.length)]
        const tempCity = tempCountry.cities[Math.floor(Math.random() * tempCountry.cities.length)]
        const address = {
            country: tempCountry.name,
            city: tempCity ?? faker.location.city(),
            address: faker.location.streetAddress()
        }
        const number = createPhoneNumber()
        const temp = {
            name: place,
            phone_number: number,
            category: "Adventure",
            address: address,
            // work_time:  // Fix
            description: faker.lorem.word(),
        }
        data.push(temp)
    })
    // fs.writeFileSync('adventure.json', JSON.stringify(data))
    return data;
}

async function createPlaces() {
    let data = [];
    // Add Restaurants (Food)
    data = data.concat(createRestaurants());
    // Create Stadiums (Sports)
    data = data.concat(createStadiums());
    // Create Musuems (Arts & HiStory)
    data = data.concat(createMusuems());
    // Create Adventure (Adventure)
    data = data.concat(createAdventure());

    await placesMongo.insertMany(data);
}

// getNames()
// createRestaurants();
// createStadiums();

module.exports = createPlaces;