const Teacher = require("../../model/user/teacher")
const bcrypt = require("bcrypt")
const {teacherValidation} = require("../../../validation/teacher")
const User = require("../../model/user/user")

//register a admin
const teacherRegistrationController = async (req, res) => {
    try{
        const { error, value } = teacherValidation.validate(req.body)//valid admin with joi 
        if(error){
            res.status(400).json({
                message: "joi validation error",
                error
            })
        }//if there have some error in joi validation
        else{
            const { password,personalInfo, userType, userId} = req.body; //get the password from req body
            const { email} = personalInfo
            const image = req.file.filename //give the image file name 
            const hashed = await bcrypt.hash(password, 10)

            //generate a new unique user id process start
            const splitedDateOfBirth = personalInfo.dateOfBirth.split("-");
            const birthYear =  splitedDateOfBirth[0]
            const birthDate = splitedDateOfBirth[splitedDateOfBirth.length - 1]

            //format of user id is (BirthDate - userID - BirthYear)
            const generateUserId = `${birthDate}${userId}${birthYear}` //get the new user id

            const newTeacher = new Teacher({
                ...req.body,
                password: hashed,
                "personalInfo.image" : image,
                userId: generateUserId
            })//create a new teacher

            const saveData = await newTeacher.save()//save the new admin
            const recoverUser = new User({
                userType,
                email
            })
            await recoverUser.save()//save the user type and email into user collection

            if(saveData){
                res.status(201).json({
                    message: "teacher has created successfully",
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
    teacherRegistrationController
}