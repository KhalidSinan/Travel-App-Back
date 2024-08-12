function getReservationDataForTripHelper(reservations) {
    let reservation_data = [];
    reservations.forEach(reservation => {
        const reservationId = reservation._id;
        const updatedData = reservation.reservation_data.map(data =>
        ({
            name: data.name,
            _id: data._id,
            passport_number: data.passport_number,
            main_reservation_id: reservationId
        }));

        reservation_data.push(...updatedData);
    });
    return reservation_data;
}


module.exports = getReservationDataForTripHelper