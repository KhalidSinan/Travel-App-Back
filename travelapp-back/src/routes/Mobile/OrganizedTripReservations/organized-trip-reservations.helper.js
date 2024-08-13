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

function checkReservationDuplicate(reservations, newReservations) {
    const allReservations = reservations.flatMap(reservation => reservation.reservation_data);
    let existingPassportNumbers = allReservations.map(reservation => reservation.passport_number);
    existingPassportNumbers = existingPassportNumbers.map(String);
    const duplicates = newReservations.filter(newReservation =>
        existingPassportNumbers.includes(newReservation.passport_number)
    );
    return duplicates.length != 0;
}


module.exports = { getReservationDataForTripHelper, checkReservationDuplicate }