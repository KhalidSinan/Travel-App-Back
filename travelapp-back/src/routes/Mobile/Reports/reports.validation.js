const Joi = require('joi')

async function validatePostReport(data) {
    const schema = Joi.object({
        report_title: Joi.string().required().messages({ 'any.required': 'Report Title Is Required' }),
        report_message: Joi.string().required().messages({ 'any.required': 'Report Message Is Required' })
    })
    return schema.validate(data, { abortEarly: false });
}

module.exports = {
    validatePostReport
}