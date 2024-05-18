const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

async function validateReserveFlight(data) {
    const reservationSchema = Joi.object({
        person_name: Joi.string().required().messages({
            'any.required': 'Person Name Required'
        }),
        person_passport: Joi.string().min(6).max(9).required().messages({
            'any.required': 'Person Passport Required'
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

module.exports = {
    validateReserveFlight
}