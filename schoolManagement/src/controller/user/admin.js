const Admin = require("../../model/user/admin")
const bcrypt = require("bcrypt")
const { adminValidation } = require("../../../validation/admin")
const User = require("../../model/user/user")

//register a admin
const registrationController = async (req, res) => {
    try{
        const { error, value } = adminValidation.validate(req.body)//valid admin with joi 
        if(error){
            res.status(400).json({
                message: "joi validation error",
                error
            })
        }//if there have some error in joi validation
        else{
            const { password, retypePassword , personalInfo, userType, userId} = req.body; //get the password from req body
            const { email} = personalInfo
            const image = req.file.filename //give the image file name 
            const hashed = await bcrypt.hash(password, 10)

            //generate a new unique user id process start
            const splitedDateOfBirth = personalInfo.dateOfBirth.split("-");
            const birthYear =  splitedDateOfBirth[0]
            const birthDate = splitedDateOfBirth[splitedDateOfBirth.length - 1]

            //format of user id is (BirthDate - userID - BirthYear)
            const generateUserId = `${birthDate}${userId}${birthYear}` //get the new user id

            const newAdmin = new Admin({
                ...req.body,
                password: hashed,
                "personalInfo.image" : image,
                userId: generateUserId
            })
            const saveData = await newAdmin.save()//save the new admin
            const recoverUser = new User({
                userType,
                email
            })
            await recoverUser.save()

            if(saveData){
                res.status(201).json({
                    message: "admin has created successfully",
                    saveData
                })
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            err
        })
    }
}



//export part
module.exports = {
    registrationController
}