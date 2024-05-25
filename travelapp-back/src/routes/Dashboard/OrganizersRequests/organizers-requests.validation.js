const Joi = require('joi');

function validateAcceptOrganizer(admin) {
    const schema = Joi.object({
        id: Joi.string().hex().length(24).messages({ 'string.hex': 'ID Must Be Valid', 'string.length': 'ID Must Be Valid' }),
    })
    return schema.validate(admin);
}

module.exports = {
    validateAcceptOrganizer
}