const Joi = require('joi');

function validateRegisterUser(user) {
    const schema = Joi.object({
        first_name: Joi.string().required().messages({
            'any.required': "Name Required",
        }),
        last_name: Joi.string().required().messages({
            'any.required': "Name Required",
        }),
        email: Joi.string().min(3).required().email().messages({
            'any.required': "Email Required",
            'string.email': "Email Must Be Valid"
        }),
        // password: joiPassword.string().minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).messages({
        //     "password.minOfUppercase": "1 Uppercase is needed",
        //     "password.minOfLowercase": "1 Lowercase is needed",
        //     "password.minOfSpecialCharacters": "1 Symbol is needed",
        //     "password.minOfNumeric": "1 Number is needed",
        // }),
        password: Joi.string().min(8).max(25).required().label('Password').messages({
            'any.required': "Password Required",
            'string.min': "Password Must Be 8 Characters"
        }),
        password_confirmation: Joi.any().equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .messages({ 'any.only': '{{#label}} does not match' }),
        device_token: Joi.string()
    })
    return schema.validate(user, { abortEarly: false });
}

function validateLoginUser(user) {
    const schema = Joi.object({
        email: Joi.string().min(3).required().messages({
            'any.required': "Email Required",
        }),
        password: Joi.string().required().messages({
            'any.required': "Password Required",
        }),
        device_token: Joi.string()
    })
    return schema.validate(user);
}

function validateForgotPassword(user) {
    const schema = Joi.object({
        email: Joi.string().min(3).required(),
    })
    return schema.validate(user);
}

function validateResetPassword(user) {
    const schema = Joi.object({
        email: Joi.string().min(3).required(),
        token: Joi.number().required(),
        password: Joi.string().min(8).required(),
        confirm_password: Joi.any().valid(Joi.ref('password')).required().label('Confirm password').messages({ 'any.only': 'Passwords do not match' })
    })
    return schema.validate(user);
}

function validateGoogleContinue(user) {
    const schema = Joi.object({
        email: Joi.string().email().min(3).required().messages({
            'any.required': "Email Required",
            'string.email': "Email Must Be Valid"
        }),
        name: Joi.string().required().messages({
            'any.required': "Name Required",
        }),
        google_id: Joi.string().required().messages({
            'any.required': "Google ID Required",
        }),
        photo_url: Joi.string(),
    })
    return schema.validate(user); s
}

module.exports = {
    validateRegisterUser,
    validateLoginUser,
    validateForgotPassword,
    validateResetPassword,
    validateGoogleContinue
}