const Joi = require("joi");

const getAllByCityValidation = Joi.object({
    city: Joi.string().optional(),
    category: Joi.string().required(),
});

const getAllNearbyValidation = Joi.object({
    userId: Joi.string().required(),
    category: Joi.string().optional(),

});

module.exports = {
    getAllByCityValidation,
    getAllNearbyValidation,
};
