const { convertDateStringToDate } = require("../../../services/convertTime");
const { getPlaneReservationCountForFlight } = require('../../../models/plane-reservation.model')

function flightFilterHelper(start_date = null, end_date = null, search = null) {
    let start_date1 = start_date;
    let end_date1 = end_date;

    if (!start_date || !end_date) {
        const twoMonthLater = new Date();
        twoMonthLater.setMonth(twoMonthLater.getMonth() + 2);
        start_date1 = new Date();
        end_date1 = twoMonthLater;
    }
    else {
        start_date1 = convertDateStringToDate(start_date1)
        end_date1 = convertDateStringToDate(end_date1);
    }

    let filter = {
        'departure_date.dateTime': {
            $gte: start_date1,
            $lte: end_date1
        }
    };

    if (search) {
        filter = {
            'departure_date.dateTime': {
                $gte: start_date1,
                $lte: end_date1
            },
            'airline.name': search
        }
    }

    return filter;
}

async function getFlightsHelper(flights) {
    await Promise.all(flights.map(async flight => {
        flight.reservationCount = await getPlaneReservationCountForFlight(flight._id)
    }))
    return flights
}

module.exports = {
    flightFilterHelper,
    getFlightsHelper
};
