const { validationErrors } = require('../../../middlewares/validationErrors');
const { getRevenueFromAnnouncements } = require('../../../models/announcements.model');
const { getTop10Countries, getAllCountries, getAllAirlines } = require('../../../models/flights.model');
const { getTop10Hotels } = require('../../../models/hotel-reservation.model');
const { getOrganizedTripsCount } = require('../../../models/organized-trips.model');
const { getTripsCount } = require('../../../models/trips.model');
const { getUsersAge } = require('../../../models/users.model');
const { serializedData } = require('../../../services/serializeArray');
const { getStatisticsCountriesHelper, announcementsRevenueHelper } = require('./statistics.helper');
const { top10HotelsData, airlineData } = require('./statistics.serializer')

async function httpGetTop10Countries(req, res) {
    const countries = await getTop10Countries();
    const data = await getStatisticsCountriesHelper(countries);
    return res.status(200).json({
        message: 'Top 10 Countries Retrieved',
        data: data
    })
}

async function httpGetAllCountries(req, res) {
    const countries = await getAllCountries();
    const data = await getStatisticsCountriesHelper(countries);
    return res.status(200).json({
        message: 'All Countries Retrieved',
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

async function httpGetTop10Hotels(req, res) {
    const data = await getTop10Hotels();
    return res.status(200).json({
        message: 'Top 10 Hotels Retrieved',
        data: serializedData(data, top10HotelsData)
    })
}

async function httpGetPercentageOfOrganizedTrips(req, res) {
    const tripsCount = await getTripsCount();
    const organizedTripsUnique = await getOrganizedTripsCount();
    const percentage = organizedTripsUnique / tripsCount * 100

    return res.status(200).json({
        message: 'Percentage Of Organized Trips',
        percentage: percentage,
        tripsCount: tripsCount,
        organizedTripsCount: organizedTripsUnique
    })
}

async function httpGetAirlinesFlights(req, res) {
    const airlines = await getAllAirlines();

    return res.status(200).json({
        message: 'Airlines Flights Found',
        data: serializedData(airlines, airlineData)
    })
}

async function httpGetRevenue(req, res) {
    const announcementsRevenue = await getRevenueFromAnnouncements();
    announcementsRevenue = announcementsRevenueHelper(announcementsRevenue)
    console.log(announcementsRevenue)
    return res.status(200).json({
        message: 'Revenue Retrieved',
        data: announcementsRevenue
    })
}


module.exports = {
    httpGetTop10Countries,
    httpGetAllCountries,
    httpGetUsersAgeStatistics,
    httpGetTop10Hotels,
    httpGetPercentageOfOrganizedTrips,
    httpGetAirlinesFlights,
    httpGetRevenue
}