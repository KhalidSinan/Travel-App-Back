const Joi = require('joi');

function validateAcceptOrganizer(organizer) {
    const schema = Joi.object({
        id: Joi.string().hex().length(24).messages({ 'string.hex': 'ID Must Be Valid', 'string.length': 'ID Must Be Valid' }),
    })
    return schema.validate(organizer);
}

function validateAlertOrganizer(organizer) {
    const schema = Joi.object({
        title: Joi.string().required().messages({ 'any.required': 'Title is Required' }),
        body: Joi.string().required().messages({ 'any.required': 'Body is Required' }),
    })
    return schema.validate(organizer);
}

module.exports = {
    validateAcceptOrganizer,
    validateAlertOrganizer
}