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

//personalInfo validation
const personalInfoValidation = Joi.object({
    name: nameValidation,
    FatherName: Joi.required(),
    MotherName: Joi.required(),
    email: Joi.string().required().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
    dateOfBirth: Joi.date().required(),
    contact: contactValiadator,
    sex: Joi.string().required(),
    profilePic: Joi.string()
})


//academicInfo validation
const academicInfoValidation = Joi.object({
    class: Joi.string().required(),
    admissionDate: Joi.date(),
    isActive: Joi.boolean(),
    syllabus:Joi.string(),
    isDeleted: Joi.boolean()
})

//modification validation
const modificationValidation = Joi.object({
    createdAt: Joi.date(),
    updatedAt: Joi.date()
})

//main validation
const studentValidation = Joi.object({
    userId:Joi.string().required().max(3).min(3),
    userType: Joi.string().required(),
    password: Joi.string().required().pattern(new RegExp ('^[a-zA-Z0-9]{6,30}$')),
    retypePassword: Joi.ref("password"),
    personalInfo: personalInfoValidation,
    academicInfo:academicInfoValidation,
    recoveryToken: Joi.string(),
    modification: modificationValidation
})

module.exports = studentValidation