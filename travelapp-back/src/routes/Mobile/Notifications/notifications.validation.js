const Joi = require('joi');

async function validatePutIsRead(notification) {
    const schema = Joi.object({
        id: Joi.string().hex().length(24).messages({ 'string.hex': 'ID Must Be Valid', 'string.length': 'ID Must Be Valid' }),
    })
    return schema.validate(notification);
}

module.exports = {
    validatePutIsRead
}