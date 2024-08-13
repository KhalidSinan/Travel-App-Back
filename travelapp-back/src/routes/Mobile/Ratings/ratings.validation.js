const Joi = require('joi');


function validatePostRating(data) {
    const schema = Joi.object({
        rating: Joi.number().min(0).max(5).required().messages({ 'any.required': 'Rate Required' })
    })
    return schema.validate(data);
}

module.exports = {
    validatePostRating
}