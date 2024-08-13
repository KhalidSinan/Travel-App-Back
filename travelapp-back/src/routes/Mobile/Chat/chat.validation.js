const Joi = require('joi');

function validateCreateChat(data) {
    const schema = Joi.object({
        chat_name: Joi.string().required().min(2).messages({
            'any.required': "Name Required",
            'string.min': "Name Should Be 2 Characters Atleast",
            "string.empty": "Name Not Allowed To Be Empty"
        }),
    })
    return schema.validate(data);
}

function validateSendMessage(data) {
    const schema = Joi.object({
        message: Joi.string().messages({
            'any.required': "Message Required",
            "string.empty": "Message Not Allowed To Be Empty"
        }),
    })
    return schema.validate(data);
}

module.exports = {
    validateCreateChat,
    validateSendMessage,
}