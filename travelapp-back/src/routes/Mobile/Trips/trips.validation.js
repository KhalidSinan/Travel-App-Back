const Joi = require('joi')

const makeTripValidation = (data) => {
    const activitiesSchema = Joi.object({
        description: Joi.string().required(),
        place: Joi.string().hex().length(24),
    })
    const citySchema = Joi.object({
        city_name: Joi.string().required(),
        hotel: Joi.string().hex().length(24),
        num_of_days: Joi.number().required(),
        activities: Joi.array().items(activitiesSchema)
    })
    const destinationSchema = Joi.object({
        country_name: Joi.string().required(),
        cities: Joi.array().items(citySchema)
    })
    const destinationsSchema = Joi.object({
        num_of_days: Joi.number().required(),
        destination: destinationSchema
    })
    const startingPlaceSchema = Joi.object({
        country: Joi.string().required(),
        city: Joi.string().required(24),
    })
    const schema = Joi.object({
        overall_num_of_days: Joi.number().required(),
        num_of_people: Joi.number().required(),
        start_date: Joi.date().required(),
        starting_place: startingPlaceSchema,
        destinations: Joi.array().items(destinationsSchema),
        flights: Joi.array().items(Joi.string().hex().length(24)),
        hotels: Joi.array().items(Joi.string().hex().length(24)),
    });
    return schema.validate(data);
};

const updateScheduleValidation = (data) => {
    const schema = Joi.object({
        description: Joi.string().required(),
        place: Joi.string().hex().length(24),
    });
    return schema.validate(data);
};

const validateAutogenerateSchedule = (data) => {
    const schema = Joi.object({
        destinations: Joi.array().items(Joi.object({
            city_name: Joi.string().required(),
            num_of_days: Joi.number().required()
        })).required(),
    });
    return schema.validate(data);
};



module.exports = {
    makeTripValidation,
    updateScheduleValidation,
    validateAutogenerateSchedule
}