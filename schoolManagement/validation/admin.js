const Joi = require("joi")

//name validation
const nameValidation = Joi.object({
    FirstName: Joi.string().required(),
    LastName: Joi.string().required()
})

//validate contact info
const contactValiadator = Joi.object({
    permanentAddress: Joi.string().required(),
    currentAddress: Joi.string().required(),
    mobileNo: Joi.string().required()
})

//degree validation
const degreeValidation = Joi.object({
    degreeName: Joi.string().required(),
    result: Joi.string().required(),
    passingYears: Joi.string().required(),
    season: Joi.string().required(),
})

//modification validation
const modificationValidation = Joi.object({
    createdAt: Joi.date(),
    updatedAt: Joi.date()
})

//personalInfo validation
const personalInfoValidation = Joi.object({
    name: nameValidation,
    email: Joi.string().required().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
    dateOfBirth: Joi.date().required(),
    contact: contactValiadator,
    sex: Joi.string().required(),
    image: Joi.string()
})

//academicInfo validation
const academicInfoValidation = Joi.object({
    degree: Joi.array().items(degreeValidation)
})

//officalInfo validation 
const officalInfoValidation = Joi.object({
     salary: Joi.string().required(),
     isActive: Joi.boolean()
})

//main validation
const adminValidation = Joi.object({
    personalInfo: personalInfoValidation,
    academicInfo: academicInfoValidation,
    officalInfo: officalInfoValidation,
    userId: Joi.string().required().max(3).min(3),
    userType: Joi.string().required(),
    password: Joi.string().required().pattern(new RegExp ('^[a-zA-Z0-9]{6,30}$')),
    retypePassword: Joi.ref("password"),
    recoveryToken: Joi.string(),
    modification: modificationValidation,
})

//password validation
const passwordValidation = Joi.object({
    password: Joi.string().required().pattern(new RegExp ('^[a-zA-Z0-9]{6,30}$'))
})


//export part
module.exports = {
    adminValidation
}
