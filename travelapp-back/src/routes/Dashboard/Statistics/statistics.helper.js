const { getRevenueFromAnnouncements } = require("../../../models/announcements.model");
const { getCountriesFlightsInAMonth } = require("../../../models/flights.model");


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

        // Find all announcements within the current month with a price
        const announcements = getRevenueFromAnnouncements(start_date, end_date)
        console.log(announcements)
        // Calculate the total revenue for the month
        const totalRevenue = announcements.reduce((sum, announcement) => sum + announcement.price, 0);

        // Push the monthly revenue data
        revenueData.push({
            month: month,
            revenue: totalRevenue,
        });
    }

    return revenueData;
}

module.exports = {
    getStatisticsCountriesHelper,
    announcementsRevenueHelper
}