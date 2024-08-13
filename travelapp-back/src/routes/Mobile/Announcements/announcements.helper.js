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

function calculateAnnouncementPrice(days, place, trip) {
    const announcementOptions = calculateAnnouncementOptions(trip);
    const pageOptions = place === "Home" ? announcementOptions.homePageOptions : announcementOptions.organizedTripsPageOptions;

    let price;
    if (days <= 1) {
        price = pageOptions.oneDay;
    } else if (days <= 3) {
        price = pageOptions.threeDays;
    } else if (days <= 7) {
        price = pageOptions.oneWeek;
    } else {
        price = pageOptions.tillTheStartOfTheTrip;
    }

    return price;
}

function generateAnnouncementData(trip) {
    const announcementOptions = calculateAnnouncementOptions(trip);
    const data = [];

    data.push({ place: "Home", duration: 1, price: announcementOptions.homePageOptions.oneDay });
    data.push({ place: "Home", duration: 3, price: announcementOptions.homePageOptions.threeDays });
    data.push({ place: "Home", duration: 7, price: announcementOptions.homePageOptions.oneWeek });
    data.push({ place: "Home", duration: -1, price: announcementOptions.homePageOptions.tillTheStartOfTheTrip });

    data.push({ place: "Organized", duration: 1, price: announcementOptions.organizedTripsPageOptions.oneDay });
    data.push({ place: "Organized", duration: 3, price: announcementOptions.organizedTripsPageOptions.threeDays });
    data.push({ place: "Organized", duration: 7, price: announcementOptions.organizedTripsPageOptions.oneWeek });
    data.push({ place: "Organized", duration: -1, price: announcementOptions.organizedTripsPageOptions.tillTheStartOfTheTrip });

    return data;
}

module.exports = {
    calculateAnnouncementOptions,
    calculateAnnouncementPrice,
    generateAnnouncementData
}