const Joi = require("joi")

// syllabus object validation
const syllabusObjectValidation = Joi.object({
    subject: Joi.string().required(),
    file: Joi.string(),
    details: Joi.string()
})

//syllabusArray validation
const syllabusArrayValidation = Joi.array().items(syllabusObjectValidation)

//main validation
const mainValidation = Joi.object({
    className: Joi.string().required(),
    description: Joi.string().required(),
    syllabus: syllabusArrayValidation
})

//export part
module.exports = mainValidation