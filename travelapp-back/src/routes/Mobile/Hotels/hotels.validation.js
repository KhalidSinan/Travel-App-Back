const Joi = require("joi");

const searchHotelsValidation = Joi.object({
    nameOrCity: Joi.string().required(),
    startDate: Joi.string().optional(),
    numDays: Joi.number().integer().min(1).optional(),
    numRooms: Joi.number().integer().min(1).optional(),
    stars: Joi.number().integer().optional(),
    sortField: Joi.string().valid('price', 'stars', 'nothing').optional(),
    order: Joi.string().valid('asc', 'desc').optional(),
    page: Joi.number().integer().min(1).optional()
});

const reservationValidation = Joi.object({
  hotelId: Joi.string().required(),
  roomCodes: Joi.array().items(Joi.string().required()).required(),
  startDate: Joi.date().required(),
  numDays: Joi.number().integer().min(1).required(),
});

module.exports = {
  searchHotelsValidation,
  reservationValidation,
};
