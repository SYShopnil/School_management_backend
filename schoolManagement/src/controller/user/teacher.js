const Teacher = require("../../model/user/teacher")
const bcrypt = require("bcrypt")
const {teacherValidation} = require("../../../validation/teacher")
const User = require("../../model/user/user")

//register a teacher
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

//update teacher infp
const updateTeacherInfoController = async (req, res) => {
    try{
        const {id} = req.params //get the student id from params
        const findTeacher  = await Teacher.findOne({_id: id}) //find the student from the database
        if(findTeacher){
            const updateTeacher = await Teacher.findByIdAndUpdate(
                {
                    _id: id
                }, //query
                {
                    $set: req.body,
                    $currentDate: {
                        "modification.updatedAt": true
                    }
                }, //update data
                {} //option
            ) //find the student and update data
            if(updateTeacher){
                res.json({
                    message: `${findTeacher.personalInfo.name.FirstName} ${findTeacher.personalInfo.name.LastName} has updated successfully`
                })
            }else{
                res.json({
                    message: "update failed"
                })
            }
        }else{
            res.json({
                message: "User not found"
            })
        }
    }
    catch(err){
        console.log(err);
        res.json({
            err
        })
    }
}

//delete a teacher
const deleteTeacherTempController = async (req, res) => {
    try{
        const {id} = req.params //get the id from params
        const findTeacher = await Teacher.findOne({_id: id}) //find the expected teacher from database
        if(findTeacher){
            const deleteTeacher = await Teacher.findByIdAndUpdate(
                {
                    _id: id
                }, //querry
                {
                    $set:{
                        "officalInfo.isDeleted": true,
                        "officalInfo.isActive": false,
                    }
                }, //update part
            )
            if(deleteTeacher){
                res.json({
                    message: `${findTeacher.personalInfo.name.FirstName} ${findTeacher.personalInfo.name.LastName} is deleted `
                })
            }
        }else{
            res.json({
                message: "User not found"
            })
        }
    }
    catch(err){
        console.log(err);
        res.json({
            err
        })
    }
}

//change active inactive status
const studentActiveInactiveController = async (req, res) => {
    try{
        const {id} = req.params //get the id from params
        const findTheTeacher  = await Teacher.findOne({_id: id}) //find the teacher  from data base 
        if(findTheTeacher){
            const teacher = findTheTeacher //store the teacher in to teacher variable 
            const {isActive} = teacher.officalInfo //get the is deleted value from database 
            // console.log(isActive); //for debugging purpose
            if(isActive == false){
                const activated = await Teacher.findOneAndUpdate(
                    {
                        _id: id //get the teacher by id
                    }, //querry
                    {
                        "officalInfo.isActive" : true //if the teacher is not active then make it active
                    }, //update
                    {} //option
                )
                if(activated){
                    res.json({
                        message: `${teacher.personalInfo.name.FirstName} ${teacher.personalInfo.name.LastName} is active now`
                    })
                }else{
                    res.json({
                        message: `${teacher.personalInfo.name.FirstName} ${teacher.personalInfo.name.LastName} activation failed`
                    })
                }
            }else if(isActive == true){
                    // console.log(isActive); //for debugging purpose
                 const inactive = await Teacher.findOneAndUpdate(
                    {
                        _id: id //get the teacher by id
                    }, //querry
                    {
                        "officalInfo.isActive" : false //if the teacher is not inactive then make it inactive
                    }, //update
                    {} //option
                )
                if(inactive){
                    res.json({
                        message: `${teacher.personalInfo.name.FirstName} ${teacher.personalInfo.name.LastName} is inactive now`
                    })
                }else{
                    res.json({
                        message: `${teacher.personalInfo.name.FirstName} ${teacher.personalInfo.name.LastName} inactivation failed`
                    })
                } 
            }
        }else{
            res.json({
                message: "teacher not found"
            })
        }
    }
    catch(err){
        console.log(err);
        res.json({
            err
        })
    }
}

//export part
module.exports = {
    teacherRegistrationController,
    updateTeacherInfoController,
    deleteTeacherTempController,
    studentActiveInactiveController
}