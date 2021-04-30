const bcrypt = require("bcrypt")
const studentValidator = require("../../../validation/student") //get the student validator
const Student = require("../../model/user/student")
const User = require("../../model/user/user")
const Class = require("../../model/academic/class")
const { updateOne } = require("../../model/user/student")
 
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
            // console.log(generateUserId);
 
            //save the new student
            const saveData = await student.save() //save new student
            if(saveData){
                res.status(201).json({
                    message: "student has created successfully",
                    saveData
                })
                await Class.updateOne(
                    {
                        className: saveData.academicInfo.class
                    }, //query
                    {
                        $inc: {
                            studentNumber: 1
                        }
                    }, //update part
                    {} //option
                )
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
 

//update student info
const updateStudentInfoController = async (req, res) => {
    try{
        const {id} = req.params //get the student id from params
        const findStudent  = await Student.findOne({_id: id}) //find the student from the database
        if(findStudent){
            const upadateStudent = await Student.findByIdAndUpdate(
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
            if(upadateStudent){
                res.json({
                    message: `${findStudent.personalInfo.name.FirstName} ${findStudent.personalInfo.name.LastName} has updated successfully`
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
 
//delete a student
const deleteStudentSingleController = async (req, res) => {
    try{
        const {id} = req.params //get the id from params
        const findStudent = await Student.findOne({_id: id}) //find the expected student from database
        if(findStudent){
            const deleteStudent = await Student.findByIdAndUpdate(
                {
                    _id: id
                }, //querry
                {
                    $set:{
                        "academicInfo.isDeleted": true,
                        "academicInfo.isActive": false,
                    }
                }, //update part
            )
            if(deleteStudent){
                res.json({
                    message: `${findStudent.personalInfo.name.FirstName} ${findStudent.personalInfo.name.LastName} is deleted `
                })

                const updateClass = await Class.updateOne(
                    {
                        className: findStudent.academicInfo.class
                    } ,//querry
                    {
                        $inc : {
                            studentNumber: -1 //delete one student from the class
                        } 
                    }, //update
                    {} //option
                )
                if(updateClass){
                    console.log("class has been update ");
                }else{
                    console.log("class update failed");
                }
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

//change active inactive student in one API
const studentActiveInactiveController = async (req, res) => {
    try{
        const {id} = req.params //get the id from params
        const findTheStudent  = await Student.findOne({_id: id}) //find the student  from data base 
        if(findTheStudent){
            const student = findTheStudent //store the student in to student variable 
            const {isActive} = student.academicInfo //get the is deleted value from database 
            // console.log(isActive); //for debugging purpose
            if(isActive == false){
                const activated = await Student.findOneAndUpdate(
                    {
                        _id: id //get the student by id
                    }, //querry
                    {
                        "academicInfo.isActive" : true //if the student is not active then make it active
                    }, //update
                    {} //option
                )
                if(activated){
                    res.json({
                        message: `${student.personalInfo.name.FirstName} ${student.personalInfo.name.LastName} is active now`
                    })
                }else{
                    res.json({
                        message: `${student.personalInfo.name.FirstName} ${student.personalInfo.name.LastName} activation failed`
                    })
                }
            }else if(isActive == true){
                    // console.log(isActive); //for debugging purpose
                 const inactive = await Student.findOneAndUpdate(
                    {
                        _id: id //get the student by id
                    }, //querry
                    {
                        "academicInfo.isActive" : false //if the student is not inactive then make it inactive
                    }, //update
                    {} //option
                )
                if(inactive){
                    res.json({
                        message: `${student.personalInfo.name.FirstName} ${student.personalInfo.name.LastName} is inactive now`
                    })
                }else{
                    res.json({
                        message: `${student.personalInfo.name.FirstName} ${student.personalInfo.name.LastName} inactivation failed`
                    })
                } 
            }
        }else{
            res.json({
                message: "student not found"
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

//profile view
const profileViewController = async (req, res) => {
    try{
        const {id} = req.params; // get the id from params
        const findsStudent = await Student.findOne(
            {
                _id: id, //find the student by id
                "academicInfo.isActive": true,
                "academicInfo.isDeleted": false

            } //querry the student who is active and not deleted
        ).select(
            "personalInfo academicInfo userId userType"
        )
        if(findsStudent){
            res.json({
                message: `Find ${findsStudent.personalInfo.name.FirstName} ${findsStudent.personalInfo.name.LastName}`,
                findsStudent
            })
        }else{
            res.json({
               message: "user not found"
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
    newStudentCreatController,
    updateStudentInfoController,
    deleteStudentSingleController,
    studentActiveInactiveController,
    profileViewController
}