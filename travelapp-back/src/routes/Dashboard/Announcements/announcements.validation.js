const Joi = require('joi');

function validatePostAnnouncement(announcement) {
    const schema = Joi.object({
        title: Joi.string().required().messages({ 'any.required': 'Title is Required' }),
        body: Joi.string().required().messages({ 'any.required': 'Body is Required' }),
        expiry_date: Joi.string()
            .required()
            .regex(/^\d{2}\/\d{2}\/\d{4}$/)
            .messages({
                'any.required': 'Expiry Date is Required',
                'string.pattern.base': 'Expiry Date must be in DD/MM/YYYY format'
            }),
    })
    return schema.validate(announcement);
}

module.exports = {
    validatePostAnnouncement
}