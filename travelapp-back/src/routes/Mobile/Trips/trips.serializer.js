function tripData(trip) {
    return {
        id: trip._id,
        source: trip.starting_place.city + ', ' + trip.starting_place.country,
        destinations: trip.destinations.map(dest => dest.city_name).join(' - '),
        start_date: trip.start_date.toLocaleDateString('en-GB'),
        overall_price: trip.overall_price,
        num_of_people: trip.num_of_people,
        num_of_days: trip.overall_num_of_days,
        completed: trip.end_date < new Date() ? true : false
    }
}

function autogenerateData(place) {
    return {
        id: place._id,
        name: place.name ?? place.place.name,
        description: place.description,
    }
}

function getTripScheduleDetails(schedule) {
    let organizedSchedule = {
        country: schedule.country_name,
        city: schedule.city_name,
        num_of_days: schedule.num_of_days,
        activities: {}
    };
    schedule.activities.forEach(activity => {
        const day = activity.day;
        if (!organizedSchedule.activities[day]) {
            organizedSchedule.activities[day] = [];
        }
        organizedSchedule.activities[day].push(activitiesDetails(activity));
    });
    return organizedSchedule;
}

function activitiesDetails(activity) {
    return {
        id: activity.place.id,
        name: activity.place.name,
        address: { country: activity.place.address.country, city: activity.place.address.city },
        phone_number: { country_code: activity.place.phone_number.country_code, number: activity.place.phone_number.number },
        category: activity.place.category,
        description: activity.place.description,
        notifiable: activity.notifiable,
    }
}

module.exports = {
    tripData,
    autogenerateData,
    getTripScheduleDetails,
    activitiesDetails
}