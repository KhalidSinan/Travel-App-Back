const { getRevenueFromAnnouncements } = require("../../../models/announcements.model");
const { getCountriesFlightsInAMonth } = require("../../../models/flights.model");
const { getRevenueFromOrganizedTrips } = require("../../../models/organized-trips.model");


async function getStatisticsCountriesHelper(countries) {
    const currentMonth = new Date().getMonth() + 1;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonth - 1);
    lastMonthStart.setDate(1);
    lastMonthStart.setHours(0, 0, 0, 0);

    const lastMonthEnd = new Date();
    lastMonthEnd.setMonth(lastMonth);
    lastMonthEnd.setDate(0);
    lastMonthEnd.setHours(23, 59, 59);

    let data = [];
    await Promise.all(
        countries.map(async country => {
            let tempCount = await getCountriesFlightsInAMonth(country.country, lastMonthStart, lastMonthEnd)
            data.push({
                country: country.country,
                count: country.count,
                lastMonthCount: tempCount
            })
        }))
    data.sort((a, b) => b.count - a.count);
    return data;
}

async function announcementsRevenueHelper() {
    const currentYear = new Date().getFullYear();
    let revenueData = [];

    for (let month = 1; month <= 12; month++) {
        const start_date = new Date(currentYear, month - 1, 1);
        const end_date = new Date(currentYear, month, 1);

        const announcements = await getRevenueFromAnnouncements(start_date, end_date)
        const totalRevenue = announcements.reduce((sum, announcement) => sum + announcement.price, 0);

        revenueData.push({
            month: month,
            revenue: totalRevenue.toFixed(2),
        });
    }

    return revenueData;
}

async function organizedTripRevenueHelper() {
    const currentYear = new Date().getFullYear();
    let revenueData = [];

    for (let month = 1; month <= 12; month++) {
        const start_date = new Date(currentYear, month - 1, 1);
        const end_date = new Date(currentYear, month, 1);

        const organizedTrips = await getRevenueFromOrganizedTrips(start_date, end_date)
        const totalRevenue = organizedTrips.reduce((sum, trip) => sum + (trip.commission * 0.1), 0);

        revenueData.push({
            month: month,
            revenue: totalRevenue.toFixed(2),
        });
    }

    return revenueData;
}

function completeRevenue(announcementsRevenue, organizedTripRevenue) {
    let data = []
    let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]
    
    for (let i = 0; i < 12; i++) {
        let temp = {
            month: months[i],
            revenue: +announcementsRevenue[i].revenue + +organizedTripRevenue[i].revenue
        }
        data.push(temp)
    }
    return data
}

module.exports = {
    getStatisticsCountriesHelper,
    announcementsRevenueHelper,
    organizedTripRevenueHelper,
    completeRevenue
}