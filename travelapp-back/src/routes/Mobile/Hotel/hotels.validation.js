
const Joi = require('joi');

const searchHotelsValidation = Joi.object({
    nameOrCity: Joi.string().required(),
    startDate: Joi.date().optional(),
    numDays: Joi.number().integer().min(1).optional(),
    numRooms: Joi.number().integer().min(1).optional()
});

const reservationValidation = Joi.object({
    hotelId: Joi.string().required(),
    roomCodes: Joi.array().items(Joi.string().required()).required(),
    userId: Joi.string().required(),
    startDate: Joi.date().required(),
    numDays: Joi.number().integer().min(1).required(),
});

module.exports = {
    searchHotelsValidation,
    reservationValidation
};
