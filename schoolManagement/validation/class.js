const Joi = require("joi")

//mai class validation 
const classValidation = Joi.object({
    className: Joi.string().required(),
    studentNumber: Joi.number(),
    description: Joi.string(),
    isDeleted: Joi.boolean()
})


//export part
module.exports = {
    classValidation
}