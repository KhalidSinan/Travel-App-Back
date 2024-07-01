const Joi = require('joi')

function validateReserveTrip(reservation) {
    const reservationDataSchema = Joi.object({
        name: Joi.string().required().messages({ 'any.required': "Number Of People is Required" }),
        gender: Joi.string().valid("Male", "Female").required().messages({ 'any.required': "Number Of People is Required" }),
        passport_number: Joi.string().min(6).max(9).required().messages({
            'any.required': 'Passport Number Required'
        }),
    })
    const schema = Joi.object({
        num_of_people: Joi.number().required().messages({ 'any.required': "Number Of People is Required" }),
        reservation_data: Joi.array().items(reservationDataSchema)
    })
    return schema.validate(reservation, { abortEarly: false });
}

function validateCancelReservation(reservation) {
    const schema = Joi.object({
        reservations: Joi.array().items(
            Joi.string().hex().length(24).required()
        )
    })
    return schema.validate(reservation, { abortEarly: false });
}


module.exports = {
    validateReserveTrip,
    validateCancelReservation
}