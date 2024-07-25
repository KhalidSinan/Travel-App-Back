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

module.exports = {
    getStatisticsCountriesHelper
}