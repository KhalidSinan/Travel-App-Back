const Joi = require('joi')

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

async function validateChangePhoneNumber(data) {
    const schema = Joi.object({
        country_code: Joi.string().required().messages({
            'any.required': 'Country Code Required To Change'
        }),
        number: Joi.string().required().messages({
            'any.required': 'Number Required To Change'
        })
    })
    return schema.validate(data);
}

async function validateChangePassword(data) {
    const schema = Joi.object({
        old_password: Joi.string().min(8).max(25).required().label('Password').messages({
            'any.required': "Password Required",
            'string.min': "Old Password Must Be 8 Characters"
        }),
        new_password: Joi.string().min(8).max(25).required().label('Password').messages({
            'any.required': "Password Required",
            'string.min': "New Password Must Be 8 Characters"
        }),
        new_password_confirmation: Joi.any().equal(Joi.ref('new_password'))
            .required()
            .messages({
                'any.only': 'Confirm Password does not match',
                'any.required': "New Password Confirmation Required",
            })
    })
    return schema.validate(data, { abortEarly: false });
}

async function validateDeleteAccount(data) {
    const schema = Joi.object({
        password: Joi.string().min(8).max(25).required().messages({
            'any.required': "Password Required",
            'string.min': "Password Must Be 8 Characters"
        }),
    })
    return schema.validate(data);
}

async function validateCheckTokenToDelete(data) {
    const schema = Joi.object({
        token: Joi.number().required(),
    })
    return schema.validate(data);
}

async function validateBecomeOrganizer(data) {
    const schema = Joi.object({
        company_name: Joi.string().required().messages({ 'any.required': 'Company Name Required' }),
        years_of_experience: Joi.number().required().messages({ 'any.required': 'Years Required' }),
        companies_worked_for: Joi.array().items(Joi.string()).required({ 'any.required': 'Companies Required Required' }),
    })
    return schema.validate(data);
}

module.exports = {
    validateChangeName,
    validateChangeGender,
    validateChangeDate,
    validateChangeLocation,
    validateChangePassword,
    validateDeleteAccount,
    validateBecomeOrganizer,
    validateChangePhoneNumber,
    validateCheckTokenToDelete
}