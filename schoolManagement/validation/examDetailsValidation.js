const Joi = require("joi")

//examResultObjValidation
const examResultObjValidation = Joi.object({
    marks: Joi.number().default(0),
    totalMark: Joi.number().default(0),
    rightAnswer: Joi.number().default(0),
    wrongAnswer: Joi.number().default(0),
    isPublished: Joi.boolean().default(false)
})

//examDetailsItemsValidation
const examDetailsItemsValidation = Joi.object({
    examType: Joi.string().default(""),
    examSubject: Joi.string().default(""),
    totalMarks: Joi.number().default(0),
    examDate: Joi.date().default(Date.now),
    result: examResultObjValidation
})

//export part
module.exports = examDetailsItemsValidation