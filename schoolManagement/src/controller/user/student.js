const bcrypt = require("bcrypt")
const studentValidator = require("../../../validation/student") //get the student validator
const Student = require("../../model/user/student")
const User = require("../../model/user/user")

//creat a student
const newStudentCreatController = async (req, res) => {
    try{
        const {error} = studentValidator.validate(req.body)
        if(error){
            console.log(error);
            res.status(406).json({
                message: "joi validation error",
                error
            })
        }else{
            const {password, userId, personalInfo, userType} = req.body //get the expected data from req body
            
            //start the procedure of creat a unique user id
            const splitedDateOfBirth = personalInfo.dateOfBirth.split("-");
            const birthYear =  splitedDateOfBirth[0]
            const birthDate = splitedDateOfBirth[splitedDateOfBirth.length - 1]
            
            //format of user id is (BirthDate - userID - BirthYear)
            const generateUserId = `${birthDate}${userId}${birthYear}` //get the new user id

            const hashedPassword = await bcrypt.hash(password, 10)//hashed the password
            // const hashedPasswordRetype = bcrypt.hash(retypePassword, 10)//hashed the retype one
            const profilePic = req.file.filename
            //creat the student
            const student = new Student({
                ...req.body,
                userId: generateUserId,
                password: hashedPassword,
                "personalInfo.profilePic": profilePic
            })//creat a new student
            console.log(generateUserId);

            //save the new student
            const saveData = await student.save() //save new student
            if(saveData){
                res.status(201).json({
                    message: "student has created successfully",
                    saveData
                })
            }
            
            //store the data in recovery model
            const {email} = personalInfo //get the email from body
            const user = new User({
                userType,
                email
            }) //creat a new user in User model
            await user.save() //save that data
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
    newStudentCreatController
}