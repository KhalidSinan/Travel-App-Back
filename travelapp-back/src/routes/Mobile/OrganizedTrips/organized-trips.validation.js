const Joi = require('joi')

function validateCreateOrganizedTrip(organized_trip) {
    const schema = Joi.object({
        trip_id: Joi.string().hex().length(24).required().messages({ 'any.required': 'Seats Num Required', 'string.hex': 'ID Must Be Valid', 'string.length': 'ID Must Be Valid' }),
        commission: Joi.number().min(0).max(10000).required().messages({ 'any.required': 'Commission Required' }),
        type_of_trip: Joi.string().required().valid("Entertainment", "Exploratory", "Therapeutic", "Artistic", "Educational").messages({ 'any.required': 'Type Of Trip Required' })
    })
    return schema.validate(organized_trip, { abortEarly: false });
}

function validateMakeDiscount(discount) {
    const schema = Joi.object({
        discount: Joi.number().min(1).max(100).required().messages({ 'any.required': 'Discount Required' })
    })
    return schema.validate(discount);
}

function validateReviewOrganizedTrip(review) {
    const schema = Joi.object({
        stars: Joi.number().min(1).max(5).required().messages({ 'any.required': 'Review Required' })
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
    validateMakeDiscount,
    validateReviewOrganizedTrip,
    validateMakeOrganizedTripAnnouncement
}