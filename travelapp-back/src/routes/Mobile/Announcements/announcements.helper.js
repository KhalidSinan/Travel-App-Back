function calculateAnnouncementOptions(trip) {
    const homePageMultiplier = 1.5;
    const endingOfAnnouncement = Math.floor((trip.start_date - new Date()) / 1000 / 60 / 60 / 24)
    const oneDay = 200
    const threeDays = 550
    const oneWeek = 1150
    const tillTheStartOfTheTrip = Math.floor(endingOfAnnouncement * oneDay - endingOfAnnouncement * (oneDay / 1.5))
    const organizedTripsPageOptions = {
        oneDay,
        threeDays,
        oneWeek,
        tillTheStartOfTheTrip,
    }
    const homePageOptions = {
        oneDay: oneDay * homePageMultiplier,
        threeDays: threeDays * homePageMultiplier,
        oneWeek: oneWeek * homePageMultiplier,
        tillTheStartOfTheTrip: tillTheStartOfTheTrip * homePageMultiplier,
    }
    return {
        homePageOptions,
        organizedTripsPageOptions
    }
}


module.exports = {
    calculateAnnouncementOptions
}