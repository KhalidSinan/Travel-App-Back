const { getReservation, deleteReservation } = require("../../../models/plane-reservation.model");
const { getHotelReservation } = require("../../../models/hotel-reservation.model");
const { getPlaceByCity } = require("../../../models/places.model");
const { getSharedTrips, cancelTrip } = require("../../../models/trips.model");
const { serializedData } = require("../../../services/serializeArray");
const { autogenerateData } = require("./trips.serializer");
const { incrementFlightSeats, getFlight } = require("../../../models/flights.model");

function makeTripPlacesToVisitHelper(destinations) {
    // helper
    let places_to_visit = [];

    destinations.forEach(destination => {
        destination.activities.forEach(activity => {
            for (let i = 0; i < activity.length; i++) {
                places_to_visit.push(activity[i].place);
            }
        })
    })
    return places_to_visit
}

function addDaysToActivities(destinations) {
    destinations.forEach(destination => {
        let activities = [];
        destination.activities.forEach((activityList, index) => {
            activityList.forEach(act => {
                activities.push({
                    place: act.place,
                    description: act.description,
                    day: index + 1
                });
            });
        });
        destination.activities = activities;
    });

    return destinations;
}


async function makeTripOverallPriceHelper(flights, hotels) {

    let flightPrices = await Promise.all(flights.map(flightReservation => getReservation(flightReservation)));
    let hotelPrices = await Promise.all(hotels.map(hotelReservation => getHotelReservation(hotelReservation)));

    let overall_price = flightPrices.reduce((acc, reservation) => acc + reservation.overall_price, 0);
    overall_price += hotelPrices.reduce((acc, reservation) => acc + reservation.room_price, 0);

    return overall_price.toFixed(2);
}

async function getSharedTripsActivitiesHelper(cityName) {
    const activities = new Set()
    const trips = await getSharedTrips(cityName);
    trips.forEach(trip => {
        const destination = trip.destinations.find(city => city.city_name == cityName)
        destination.activities.forEach(activity => {
            activities.add(activity);
        })
    });
    return [...activities];
}

async function autogenerateScheduleForTripHelper(destinations) {
    let data = [];
    await Promise.all(destinations.map(async (destination) => {
        let temp = { city_name: destination.city_name, days: [] };
        const activities = await getSharedTripsActivitiesHelper(destination.city_name);
        let uniqueActivities = new Set(activities);
        const activitiesFromDB = await getPlaceByCity(destination.city_name, 50);
        activitiesFromDB.forEach(activity => uniqueActivities.add(activity));
        if (uniqueActivities.size > 0) {
            const activityArray = Array.from(uniqueActivities);
            const avgperday = Math.max(Math.floor(activityArray.length / destination.num_of_days), 1);
            for (let i = 0; i < destination.num_of_days; i++) {
                let dayActivities = [];
                let usedIndexes = new Set();
                while (dayActivities.length < avgperday && dayActivities.length < activityArray.length) {
                    const randomIndex = Math.floor(Math.random() * activityArray.length);
                    if (!usedIndexes.has(randomIndex)) {
                        dayActivities.push(activityArray[randomIndex]);
                        usedIndexes.add(randomIndex);
                    }
                }
                temp.days.push({ day: i + 1, activities: serializedData(dayActivities, autogenerateData) });
            }
        }
        data.push(temp);
    }));
    return data;
}


async function cancelTripHelper(trip, trip_id) {
    trip.flights.forEach(async flight => {
        const planeReservation = await getReservation(flight)
        await incrementFlightSeats(planeReservation.flights[0]._id, planeReservation.reservations.data[0].seat_class, planeReservation.num_of_reservations)
        await deleteReservation(planeReservation)
    })
    await cancelTrip(trip_id)
}

async function setNotificationDateForActivity(trip, activity_id, time) {
    let date = new Date(trip.start_date);
    const timeParts = time.split(":");
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    let totalDaysFromPreviousDestinations = 0;

    for (let i = 0; i < trip.destinations.length; i++) {
        if (i === trip.destinations.findIndex(dest => {
            return dest.activities.some(activity => activity.place._id.toString() === activity_id.toString());
        })) {
            break;
        } else {
            totalDaysFromPreviousDestinations += trip.destinations[i].num_of_days;
        }
    }
    const destination = trip.destinations.find(dest => {
        return dest.activities.some(activity => activity.place._id.toString() === activity_id.toString());
    });

    if (destination) {
        const activity = destination.activities.find(act => act.place._id.toString() === activity_id.toString());

        if (activity) {
            date.setDate(date.getDate() + (totalDaysFromPreviousDestinations + activity.day - 1));
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours + 3, minutes);
        }
    }
    return null
}


module.exports = {
    makeTripPlacesToVisitHelper,
    makeTripOverallPriceHelper,
    autogenerateScheduleForTripHelper,
    cancelTripHelper,
    addDaysToActivities,
    setNotificationDateForActivity
}