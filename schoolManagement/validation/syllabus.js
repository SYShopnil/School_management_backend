const Joi = require("joi")

//main validation
const mainValidation = Joi.object({
    className: Joi.string().required(),
    description: Joi.string().required(),
    file: Joi.string()
})

//export part
module.exports = mainValidation