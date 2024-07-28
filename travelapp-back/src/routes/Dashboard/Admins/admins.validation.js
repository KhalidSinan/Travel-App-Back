const Joi = require('joi');

function validateLoginAdmin(admin) {
    const schema = Joi.object({
        username: Joi.string().min(3).required().messages({
            'any.required': "Username Required",
        }),
        password: Joi.string().min(8).required().messages({
            'any.required': "Password Required",
        }),
    })
    return schema.validate(admin);
}

function validatePostAdmin(admin) {
    const schema = Joi.object({
        username: Joi.string().min(3).required().messages({
            'any.required': "Username Required",
        }),
        password: Joi.string().min(8).max(25).required().label('Password').messages({
            'any.required': "Password Required",
            'string.min': "Password Must Be 8 Characters"
        }),
        password_confirmation: Joi.any().equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .messages({ 'any.only': '{{#label}} does not match' }),
        role: Joi.string().min(3).required()
            .valid('Reports-Admin', 'Announcements-Admin', 'Notifications-Admin', 'Organizers-Admin')
            .messages({
                'any.required': "Role Required",
            }),
    })
    return schema.validate(admin);
}

function validateDeleteAdmin(admin) {
    const schema = Joi.object({
        password: Joi.string().min(8).required().messages({
            'any.required': "Password Required",
        }),
    })
    return schema.validate(admin);
}

module.exports = {
    validateLoginAdmin,
    validatePostAdmin,
    validateDeleteAdmin
}