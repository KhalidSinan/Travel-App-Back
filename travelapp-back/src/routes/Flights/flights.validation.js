const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

async function validateReserveFlight(data) {
    const reservationSchema = Joi.object({
        person_name: Joi.string().required().messages({
            'any.required': 'Person Required'
        }),
        seat_class: Joi.string().required().messages({
            'any.required': 'Seat Class Required'
        })
    })

    const schema = Joi.object({
        flights: Joi.array().messages({ 'any.required': 'Flight ID(s) Required' }),
        reservation_type: Joi.string().required().messages({ 'any.required': 'Reservation Type Required' }),
        reservations: Joi.array().items(reservationSchema).messages({ 'any.required': 'Reservations Data Required' }),
    })
    return schema.validate(data, { abortEarly: false });
}

async function validateGetFlights(data) {
    const schema = Joi.object({
        source: Joi.string().required().messages({ 'any.required': 'Source Country Required' }),
        destination: Joi.string().required().messages({ 'any.required': 'Destination Required' }),
        date: Joi.string().required().messages({ 'any.required': 'Date Required' }),
        class_of_seats: Joi.string().required().messages({ 'any.required': 'Class Required' }),
        num_of_seats: Joi.number().required().messages({ 'any.required': 'Number Of Seats Required' }),
    })
    return schema.validate(data, { abortEarly: false });
}

async function validateGetFlight(data) {
    const schema = Joi.object({
        id_back: Joi.string().hex().length(24).messages({ 'string.hex': 'ID Must Be Valid', 'string.length': 'ID Must Be Valid' }),
        class: Joi.string().length(1).required().messages({ 'any.required': 'Class Required' }),
    })
    return schema.validate(data, { abortEarly: false });
}

module.exports = {
    validateReserveFlight,
    validateGetFlights,
    validateGetFlight
}