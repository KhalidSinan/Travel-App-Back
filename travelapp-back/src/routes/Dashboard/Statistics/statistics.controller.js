const { validationErrors } = require('../../../middlewares/validationErrors');
const { getTop10Countries } = require('../../../models/flights.model');
const { getUsersAge } = require('../../../models/users.model');
const { getTop10CountriesHelper } = require('./statistics.helper');

async function httpGetTop10Countries(req, res) {
    const countries = await getTop10Countries();
    const data = await getTop10CountriesHelper(countries);
    return res.status(200).json({
        message: 'Top 10 Countries Retrieved',
        data: data
    })
}

async function httpGetUsersAgeStatistics(req, res) {
    const data = await getUsersAge();
    return res.status(200).json({
        message: 'Users Ages Retrieved',
        data: data
    })
}

// async function httpGetTop10Hotels(req, res) {
//     const data = await getTop10Hotels();
//     return res.status(200).json({
//         message: 'Top 10 Hotels Retrieved',
//         data: data
//     })
// }

// async function httpGetRevenue(req, res) {
//     const data = await getRevenue();
//     return res.status(200).json({
//         message: 'Revenue Retrieved',
//         data: data
//     })
// }


module.exports = {
    httpGetTop10Countries,
    httpGetUsersAgeStatistics,
    // httpGetTop10Hotels,
    // httpGetRevenue
}