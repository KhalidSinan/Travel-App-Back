const Joi = require("joi");

const searchHotelsValidation = Joi.object({
  nameOrCity: Joi.string().required(),
  startDate: Joi.string().allow('').optional(),
  numDays: Joi.number().integer().min(0).optional(),
  numRooms: Joi.number().integer().min(0).optional(),
  stars: Joi.number().optional(),
  sortField: Joi.string().valid('price', 'stars', 'nothing').optional(),
  order: Joi.string().valid('asc', 'desc').optional(),
  page: Joi.number().integer().min(1).optional()
});

const reservationValidation = Joi.object({
  hotelId: Joi.string().hex().length(24).messages({ 'string.hex': 'ID Must Be Valid', 'string.length': 'ID Must Be Valid' }),
  // hotelId: Joi.string().required(),
  roomCodes: Joi.required(),
  startDate: Joi.date().required(),
  numDays: Joi.number().integer().min(1).required(),
});

const searchHotelsByCityValidation = Joi.object({
  city: Joi.string().required(),
  startDate: Joi.string().allow('').optional(),
  numDays: Joi.number().integer().min(0).optional(),
  numRooms: Joi.number().integer().min(0).optional(),
  page: Joi.number().integer().min(1).optional()
});

module.exports = {
  searchHotelsValidation,
  reservationValidation,
  searchHotelsByCityValidation
};