const Joi = require("joi")

//modification validation
const modificationValidation = Joi.object({
    createdAt: Joi.date(),
    updatedAt: Joi.date()
})

//period items
const periodItems = Joi.object({
    no: Joi.number().required(),
    subject: Joi.string().required(),
    teacherName: Joi.string(),
    timeStart : Joi.string().required(),
    timeEnd: Joi.string().required()
})

//routine validation
const arrayElement = Joi.object({
    day: Joi.string().required(),
    period: Joi.array().items(periodItems)
})

//statusValidation validation
const statusValidation = Joi.object({
    isDeleted: Joi.boolean()
})

//class routine main validation
const mainValidation = Joi.object({
    className: Joi.string().required(),
    routine: Joi.array().items(arrayElement),
    status: statusValidation,
    modification: modificationValidation,
})

//export part
module.exports = mainValidation