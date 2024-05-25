const Joi = require('joi')

function validateCreateOrganizedTrip(organized_trip) {
    const schema = Joi.object({
        trip_id: Joi.string().hex().length(24).required().messages({ 'any.required': 'Seats Num Required', 'string.hex': 'ID Must Be Valid', 'string.length': 'ID Must Be Valid' }),
        overall_seats: Joi.number().min(1).required().messages({ 'any.required': 'Seats Num Required' }),
        commission: Joi.number().min(1).max(30).required().messages({ 'any.required': 'Commission Required' })
    })
    return schema.validate(organized_trip, { abortEarly: false });
}

module.exports = {
    validateCreateOrganizedTrip
}