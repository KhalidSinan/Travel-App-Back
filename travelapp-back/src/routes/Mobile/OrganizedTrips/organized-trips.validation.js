const Joi = require('joi')

function validateCreateOrganizedTrip(organized_trip) {
    const schema = Joi.object({
        trip_id: Joi.string().hex().length(24).required().messages({ 'any.required': 'Seats Num Required', 'string.hex': 'ID Must Be Valid', 'string.length': 'ID Must Be Valid' }),
        commission: Joi.number().min(0).max(10000).required().messages({ 'any.required': 'Commission Required' }),
        type_of_trip: Joi.array().items(Joi.string().valid("Entertainment", "Exploratory", "Therapeutic", "Artistic", "Educational")).required().messages({
            'any.required': 'Type Of Trip Required',
            'array.base': 'Type of Trip Must Be an Array',
            'array.items': 'Invalid Type of Trip'
        }),
        description: Joi.string().required().messages({ 'any.required': 'Commission Required' }),
    });
    return schema.validate(organized_trip, { abortEarly: false });
}

function validateReviewOrganizedTrip(review) {
    const schema = Joi.object({
        rating: Joi.number().min(0).max(5).required().messages({ 'any.required': 'Rating Required' })
    })
    return schema.validate(review);
}

function validateMakeOrganizedTripAnnouncement(announcement) {
    const schema = Joi.object({
        announcement_title: Joi.string().allow(''),
        announcement_body: Joi.string().allow(''),
        num_of_days: Joi.number().required().messages({ 'any.required': 'Number Of Days is Required' }),
        location: Joi.string().valid('Home', 'Organized').required().messages({ 'any.required': 'Location is Required' }),
    })
    return schema.validate(announcement);
}

module.exports = {
    validateCreateOrganizedTrip,
    validateReviewOrganizedTrip,
    validateMakeOrganizedTripAnnouncement
}