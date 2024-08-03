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
                let selectedActivities = [];
                const number_of_activities = Math.floor(Math.random() * 5) + 2;
                while (selectedActivities.length < number_of_activities && uniqueActivities.size > 0) {
                    const randomActivityId = [...uniqueActivities][Math.floor(Math.random() * uniqueActivities.size)];
                    const activity = activities.find(activity => activity.place_id.toString() === randomActivityId);
                    if (activity) {
                        selectedActivities.push(activity);
                        uniqueActivities.delete(randomActivityId);
                    }
                }
                while (selectedActivities.length < number_of_activities) {
                    const remainingActivitiesNeeded = number_of_activities - selectedActivities.length;
                    const additionalActivities = await getPlaceByCity(destination.city_name, 3 * remainingActivitiesNeeded);
                    for (let j = 0; j < additionalActivities.length && selectedActivities.length < number_of_activities; j++) {
                        const activity = additionalActivities[j];
                        const activityId = activity._id.toString();
                        if (!selectedActivities.some(a => a.place_id.toString() === activityId)) {
                            selectedActivities.push({
                                place_id: activity._id,
                                place_name: activity.name,
                            });
                            uniqueActivities.delete(activityId);
                        }
                    }
                }
                temp.days.push(selectedActivities);
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