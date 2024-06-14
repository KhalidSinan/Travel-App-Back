const Joi = require('joi')

const makeTripValidation = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        overall_num_of_days: Joi.number().required(),
        num_of_people: Joi.number().required(),
        overall_price: Joi.number().required(),
        start_date: Joi.date().required(),
        starting_place: Joi.string().required(),
        destinations: Joi.array().items(Joi.object({
            city_name: Joi.string().required(),
            hotel_id: Joi.string().required(),
            num_of_days: Joi.number().required(),
            days: Joi.array().items(Joi.object({
                activities: Joi.array().items(Joi.string())
            }))
        })),
        flights: Joi.array().items(Joi.string().required()),
        hotels: Joi.array().items(Joi.string().required()),
        places_to_visit: Joi.array().items(Joi.string().required())
    });
    return schema.validate(data);
};

const updateScheduleValidation = (data) => {
    const schema = Joi.object({
        destinations: Joi.array().items(Joi.object({
            city_name: Joi.string().required(),
            hotel_id: Joi.string().required(),
            num_of_days: Joi.number().required(),
            days: Joi.array().items(Joi.object({
                activities: Joi.array().items(Joi.string())
            }))
        })),
        flights: Joi.array().items(Joi.string().required()),
        hotels: Joi.array().items(Joi.string().required()),
        places_to_visit: Joi.array().items(Joi.string().required())
    });
    return schema.validate(data);
};

module.exports = {
    makeTripValidation, updateScheduleValidation
}