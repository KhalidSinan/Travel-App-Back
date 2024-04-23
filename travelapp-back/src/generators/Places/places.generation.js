const fs = require('fs')
const { faker } = require('@faker-js/faker')
const restaurants = require('../../public/json/restaurants(final).json')
const location = require('../../public/json/countries-all.json')
const numbers = require('../../public/json/phone_number.json')
const stadiums = require('../../public/json/stadiums(final).json')
const musuems = require('../../public/json/musuem-names.json')
const poi = require('../../public/json/poi-names.json')
const places = require('../../public/json/cinemas-parks.json')
const attractions = require('../../public/json/attractions.json')
const random = require('../../public/json/random.json')
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
    data = places
    console.log(data)
    // fs.writeFileSync('musuem-names.json', JSON.stringify(data))
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

function createCinemasParks() {
    let data = []
    let i = 0;
    places.forEach(el => {
        const address = {
            country: el.address.country,
            city: faker.location.city(),
            address: faker.location.streetAddress()
        }
        const number = createPhoneNumber()
        const temp = {
            name: el.name,
            phone_number: number,
            category: el.category,
            // Or Entertainment
            address: address,
            // work_time:  // Fix
            description: faker.lorem.word(),
        }
        i++;
        data.push(temp)
    })
    // fs.writeFileSync('cinemas-parks.json', JSON.stringify(data))
    return data;
}

function createAttractions() {
    let data = []
    attractions.forEach(el => {
        const address = {
            country: el.address.country,
            city: faker.location.city(),
            address: faker.location.streetAddress()
        }
        const number = createPhoneNumber()
        const temp = {
            name: el.name,
            phone_number: number,
            category: 'Attraction',
            address: address,
            description: faker.lorem.word(),
        }
        data.push(temp)
    })
    // fs.writeFileSync('attractions.json', JSON.stringify(data))
    return data;
}

function createRandom() {
    let data = []
    let categories = ['Park', 'Attraction', 'Adventure', 'Arts & History']
    random.forEach(el => {
        const address = {
            country: faker.location.country(),
            city: faker.location.city(),
            address: faker.location.streetAddress()
        }
        const number = createPhoneNumber()
        const temp = {
            name: el.name,
            phone_number: number,
            category: categories[Math.floor(Math.random() * categories.length)],
            address: address,
            description: faker.lorem.word(),
        }
        data.push(temp)
    })
    // fs.writeFileSync('random.json', JSON.stringify(data))
    return data;
}

async function createPlaces() {
    let data = [];
    // Add Restaurants (Food)
    data = data.concat(createRestaurants());
    // Create Stadiums (Sports)
    data = data.concat(createStadiums());
    // Create Musuems (Arts & History)
    data = data.concat(createMusuems());
    // Create Adventure (Adventure)
    data = data.concat(createAdventure());
    // Create Cinemas And Parks
    data = data.concat(createCinemasParks());
    // Create Attractions
    data = data.concat(createAttractions());
    // Create Remaining Random Data
    data = data.concat(createRandom());

    await placesMongo.insertMany(data);
}

// createCinemasParks()

module.exports = createPlaces;