const Joi = require('joi');

function validatePostNotification(notification) {
    const schema = Joi.object({
        notification_title: Joi.string().required().messages({ 'any.required': 'Title is Required' }),
        notification_body: Joi.string().required().messages({ 'any.required': 'Body is Required' }),
    })
    return schema.validate(notification);
}

module.exports = {
    validatePostNotification
}