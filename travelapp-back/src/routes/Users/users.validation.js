const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)


async function validateChangeName(data) {
    const schema = Joi.object({
        first_name: Joi.string().min(2).required().messages({
            'any.required': 'First Name Required To Change',
            'string.min': '2 Characters Needed Atleast'
        }),
        last_name: Joi.string().min(2).required().messages({
            'any.required': 'Last Name Required To Change',
            'string.min': '2 Characters Needed Atleast'
        })
    })
    return schema.validate(data);
}

async function validateChangeGender(data) {
    const schema = Joi.object({
        gender: Joi.string().valid('Male', 'Female').required().messages({
            'any.required': 'Gender Required To Change'
        })
    })
    return schema.validate(data);
}

async function validateChangeDate(data) {
    const schema = Joi.object({
        date: Joi.date().required().messages({
            'any.required': 'Date Required To Change'
        })
    })
    return schema.validate(data);
}

async function validateChangeLocation(data) {
    const schema = Joi.object({
        city: Joi.string().required().messages({
            'any.required': 'City Required To Change'
        }),
        country: Joi.string().required().messages({
            'any.required': 'Country Required To Change'
        })
    })
    return schema.validate(data);
}

module.exports = {
    validateChangeName,
    validateChangeGender,
    validateChangeDate,
    validateChangeLocation
}