const countries = require('../public/json/countries-all.json')
const airlines = require('../public/json/airlines.json')

function getCountries() {
    let data = []
    countries.forEach(country => data.push(country.name))
    return data;
}

function getAirlines() {
    let data = []
    airlines.forEach(airline => data.push(airline.name))
    return data;
}

function getCities() {
    // let data = []
    // countries.forEach(country => data.push(country.name))
    return countries;
}

module.exports = {
    getCountries,
    getCities,
    getAirlines
}