const { getReservation, deleteReservation } = require("../../../models/plane-reservation.model");
const { getHotelReservation } = require("../../../models/hotel-reservation.model");
const { getPlaceByCity } = require("../../../models/places.model");
const { getSharedTrips, cancelTrip } = require("../../../models/trips.model");

function makeTripPlacesToVisitHelper(destinations) {
    // helper
    let places_to_visit = [];

    destinations.forEach(destination => {
        destination.activities.forEach(activity => {
            places_to_visit.push(activity.place);
        })
    })
    return places_to_visit
}

async function makeTripOverallPriceHelper(flights, hotels) {

    let flightPrices = await Promise.all(flights.map(flightReservation => getReservation(flightReservation)));
    let hotelPrices = await Promise.all(hotels.map(hotelReservation => getHotelReservation(hotelReservation)));

    let overall_price = flightPrices.reduce((acc, reservation) => acc + reservation.overall_price, 0);
    overall_price += hotelPrices.reduce((acc, reservation) => acc + reservation.room_price, 0);

    return overall_price;
}

async function getSharedTripsActivitiesHelper(cityName) {
    const activities = new Set()
    const trips = await getSharedTrips(cityName);
    trips.forEach(trip => {
        const destination = trip.destinations.find(city => city.city_name == cityName)
        destination.activities.forEach(activity => {
            activities.add({
                place_id: activity.place._id,
                place_name: activity.place.name,
            });
        })
    });
    return [...activities];
}

async function autogenerateScheduleForTripHelper(destinations) {
    let data = []
    await Promise.all(destinations.map(async (destination) => {
        let temp = { city_name: destination.city_name, days: [] }
        const activities = await getSharedTripsActivitiesHelper(destination.city_name);
        if (activities.length > 0) {
            let uniqueActivities = new Set(activities.map(activity => activity.place_id.toString()));
            for (let i = 0; i < destination.num_of_days; i++) {
                let selectedActivities = uniqueActivities;
                const additionalActivities = await getPlaceByCity(destination.city_name, 5);
                selectedActivities.add(additionalActivities)
                temp.days.push(additionalActivities.map(activity => activity._id));
            }
        }
        data.push(temp);
    }));
    return data;
}

async function cancelTripHelper(trip, trip_id) {
    trip.flights.forEach(async flight => {
        await deleteReservation(flight)
    })
    await cancelTrip(trip_id)
}


module.exports = {
    makeTripPlacesToVisitHelper,
    makeTripOverallPriceHelper,
    autogenerateScheduleForTripHelper,
    cancelTripHelper
}