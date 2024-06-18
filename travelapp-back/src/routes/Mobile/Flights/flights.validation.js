const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

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

async function validateGetFlightsOptions(data) {
    const filterSchema = Joi.object({
        time_start: Joi.string().default(null),
        time_end: Joi.string().default(null),
        min_price: Joi.number().default(-Infinity),
        max_price: Joi.number().default(Infinity),
    })

    const destinationSchema = Joi.object({
        country: Joi.string().required(),
        days: Joi.number().required(),
        filter: filterSchema
    })

    const schema = Joi.object({
        source: Joi.string().required().messages({ 'any.required': 'Source Required' }),
        destinations: Joi.array().items(destinationSchema).required().messages({ 'any.required': 'Destinations Required' }),
        start_date: Joi.string().required().messages({ 'any.required': 'Date Required' }),
        class_of_seats: Joi.string().required().messages({ 'any.required': 'Class Required' }),
        num_of_seats: Joi.number().required().messages({ 'any.required': 'Number Of Seats Required' }),
        is_return: Joi.boolean().required().messages({ 'any.required': 'Return Required' })
    })
    return schema.validate(data, { abortEarly: false });
}

module.exports = {
    validateGetFlights,
    validateGetFlight,
    validateGetFlightsOptions
}