const Joi = require('joi');

function validatePostAnnouncement(announcement) {
    const schema = Joi.object({
        title: Joi.string().required().messages({ 'any.required': 'Title is Required' }),
        body: Joi.string().required().messages({ 'any.required': 'Body is Required' }),
    })
    return schema.validate(announcement);
}

module.exports = {
    validatePostAnnouncement
}