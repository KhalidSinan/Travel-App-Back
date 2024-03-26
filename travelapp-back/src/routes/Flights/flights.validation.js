const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

async function validateReserveFlight(data) {
    const reservationSchema = Joi.object({

    })

    const schema = Joi.object({
        reservation_type: Joi.string().required().messages('any.required', 'Reservation Type Required'),
        reservations: Joi.array().items(reservationSchema)
    })
    return schema.validate(data, { abortEarly: false });
}


module.exports = {
    validateReserveFlight
}