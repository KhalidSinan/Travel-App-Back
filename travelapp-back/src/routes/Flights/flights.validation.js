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
        reservation_type: Joi.string().required().messages({ 'any.required': 'Reservation Type Required' }),
        reservations: Joi.array().items(reservationSchema)
    })
    return schema.validate(data, { abortEarly: false });
}

async function validateGetFlights(data) {
    const schema = Joi.object({
        source: Joi.string().required().messages({ 'any.required': 'Source Country Required' }),
        destination: Joi.string().required().messages({ 'any.required': 'Destination Required' }),
        date: Joi.string().required().messages({ 'any.required': 'Date Required' }),
    })
    return schema.validate(data, { abortEarly: false });
}

module.exports = {
    validateReserveFlight,
    validateGetFlights,
}