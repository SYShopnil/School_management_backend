const Joi = require("joi")

//update password
const passwordValidation = Joi.object({
    newPassword: Joi.string().required().pattern(new RegExp ('^[a-zA-Z0-9]{6,30}$')),
    confirmPassword: Joi.ref("newPassword"),
    oldPassword: Joi.string().required().pattern(new RegExp ('^[a-zA-Z0-9]{6,30}$'))
})

//reset password 
const resetPasswordValidation = Joi.object({
    newPassword: Joi.string().required().pattern(new RegExp ('^[a-zA-Z0-9]{6,30}$')),
    confirmPassword: Joi.ref("newPassword"),
    token: Joi.string().required()
})
//export part
module.exports = {
    passwordValidation,
    resetPasswordValidation
}