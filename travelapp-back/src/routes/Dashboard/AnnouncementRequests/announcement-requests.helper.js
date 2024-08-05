const { getToken } = require("../../../models/code_confirmation.model")
const { convertDateStringToDate } = require("../../../services/convertTime");

function filterAnnouncementRequestsHelper(data) {
    let { start_date, end_date } = data
    const filter = {};
    if (start_date && end_date) {
        start_date = convertDateStringToDate(start_date)
        end_date = convertDateStringToDate(end_date);
        filter.createdAt = {
            $gte: new Date(start_date),
            $lte: new Date(end_date)
        }
    }
    return filter
}

async function confirmTokenHelper(user, token) {
    const tokenSaved = await getToken(user.id)
    return token == tokenSaved.token
}

function calculatePriceForAnnouncement(num_of_days, location, trip) {
    const homePageMultiplier = 1.5;
    const endingOfAnnouncement = Math.floor((trip.start_date - new Date()) / 1000 / 60 / 60 / 24)
    const oneDay = 200
    const threeDays = 550
    const oneWeek = 1150
    const tillTheStartOfTheTrip = Math.floor(endingOfAnnouncement * oneDay - endingOfAnnouncement * (oneDay / 1.5))
    if (location == 'Home') {
        if (num_of_days == 1) return oneDay * homePageMultiplier
        if (num_of_days == 3) return threeDays * homePageMultiplier
        if (num_of_days == 7) return oneWeek * homePageMultiplier
        if (num_of_days == -1) return tillTheStartOfTheTrip * homePageMultiplier
    } else {
        if (num_of_days == 1) return oneDay
        if (num_of_days == 3) return threeDays
        if (num_of_days == 7) return oneWeek
        if (num_of_days == -1) return tillTheStartOfTheTrip
    }
}

function expiryDateHelper(trip, num_of_days) {
    let expiry_date = new Date();
    expiry_date.setUTCDate(expiry_date.getUTCDate() + num_of_days)
    return num_of_days == -1 ?
        Math.floor((trip.start_date - new Date()) / 1000 / 60 / 60 / 24) :
        expiry_date
}

module.exports = {
    confirmTokenHelper,
    filterAnnouncementRequestsHelper,
    calculatePriceForAnnouncement,
    expiryDateHelper
}