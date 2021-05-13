const bcrypt = require("bcrypt")
const studentValidator = require("../../../validation/student") //get the student validator
const Student = require("../../model/user/student")
const User = require("../../model/user/user")
const Class = require("../../model/academic/class")
const jwtDecode = require("jwt-decode")
const { updateOne, findOne } = require("../../model/user/student")
const Syllabus = require("../../model/academic/syllabus")
const Teacher = require("../../model/user/teacher")
const ClassRoutine = require("../../model/academic/classRoutine")
const nodemailer = require("nodemailer")
require("dotenv").config() 

//get the nodemailer mail
const Email = process.env.USER //ge the email from dot env file
const password = process.env.PASSWORD // get the password from dot env file
 
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
            const {class:className} = req.body.academicInfo //get the class name from req body
            const isValidClass = await Class.findOne({className}) //find the class name
            if(isValidClass){
                    //start the procedure of creat a unique user id
                const splitedDateOfBirth = personalInfo.dateOfBirth.split("-")
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
            }else{
                res.status(404).json({
                    message: "Class not found"
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
            const {isDeleted} = findStudent.academicInfo //find the is deleted current status
            if(isDeleted == false){
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
                    message: `${findStudent.personalInfo.name.FirstName} ${findStudent.personalInfo.name.LastName} is already deleted `
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
                        _id: id ,//get the student by id,
                        "academicInfo.isDeleted": false
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
                        _id: id ,//get the student by id
                        "academicInfo.isDeleted": false
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


//view all student by class
const viewAllStudentByClass = async (req, res) => {
    try{
        const {className} = req.params //get the class name from params
        const findClass = await Class.findOne({className}) //find the class
        if(findClass){
            const findStudent = await Student.find(
                {
                    "academicInfo.class": className //querry data by class name
                }
            )
            if(findStudent){
                res.status(200).json({
                    findStudent
                })
            }else{
                res.status(404).json({
                    message: "Student not found"
                })
            }
        }else{
            res.status(404).json({
                message: "Class not found"
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(404).json({
            err
        })
    }
}

//view individual student by id
const individualStudentByIdController = async (req, res) => {
    try{
        const {id} = req.params; //get the student from params
        const findStudent = await Student.findOne({_id: id}) //find the student by id
        if(findStudent){
            const student = findStudent //store the student here
            res.json({
                message: `${student.personalInfo.name.FirstName} ${student.personalInfo.name.LastName} found`,
                student 
            })
        }else{
            res.status(404).json({
                messasge: "student not found"
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

//view syllabus 
const viewSyllabusController = async (req, res) => {
    try{
        const token = req.header("Authorization") //get the token from body header
        const tokenData = jwtDecode(token) //get the data
        const {userType, id} = tokenData;
        if(userType == "student"){
            const findStudent = await Student.findOne({_id: id})
            if(findStudent){
                
                const student = findStudent //store the data of findStudent
                const {class:className} = student.academicInfo
                const findSyllabus = await Syllabus.findOne({className})
                if(findSyllabus){
                    res.json({
                        message: "syllabus have found",
                        findSyllabus
                    })
                }else{
                    res.staus(404).json({
                        message: "syllabus not found"
                    })
                }
            }else{
                res.status(404).json({
                    message: "Student not found"
                })
            }
        }else{
            res.status(404).json({
                message: "This is not a valid user"
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

//download syllabus
const downloadSyllabusController = async (req, res) => {
    try{
        const token = req.header("Authorization") //get the token from body header
        const {subject} = req.params //get the data from params
        const tokenData = jwtDecode(token) //get the data
        const {userType, id} = tokenData;
        if(userType == "student"){
            const findStudent = await Student.findOne({_id: id}) //find the student
            if(findStudent){
                const {class:className} = findStudent.academicInfo //get the class of that student
                const getTheSyllabusFile = await Syllabus.findOne(
                    {
                        className
                    }
                ) //search the expected syllabus
                
                if(getTheSyllabusFile){
                    // console.log(subject); //for debug purpose
                    const {syllabus} = getTheSyllabusFile //get the file name
                    const getTheSubject = syllabus.find(subjectObj => {
                        if(subjectObj.subject == subject){
                            return subjectObj
                        }
                    })
                    // console.log(getTheSubject); //for debug purpose
                    const {file: filePathName} = getTheSubject //get  the file name from the database
                    if(filePathName){
                        const route = `E:/Topper/MERN/Project/school-management_backend/schoolManagement/documents/file/${filePathName}`
                        res.download(route, (err) => {
                            if(err){
                                console.log(err);
                            }else{
                                console.log("Download successfully");
                            }
                        })
                    }else{
                        res.staus(404).json({
                            message: "file not found in the root file"
                        })
                    }
                }else{
                    res.staus(404).json({
                        message: "syllabus not found"
                    })
                }
            }else{
                res.status(404).json({
                    message: "student not found"
                })
            }
        }
    }
    catch(err){
        err
    }
}

//view own class routine
const viewOwnClassRoutineController = async (req, res) => {
    try{
        const token = req.header("Authorization") //get the token from body header
        const tokenData = jwtDecode(token) //get the data
        const {id} = tokenData //get the data from token
        const isValidStudent = await Student.findOne(
            {
                _id: id,
                "academicInfo.isActive": true,
                "academicInfo.isDeleted": false
            }
        ) //check is it a valid student
        if(isValidStudent){
            const student = isValidStudent //store the student to the student variable
            const {class: className} = student.academicInfo //get the class name
            const findRoutine = await ClassRoutine.findOne(
                {
                    className,
                    "status.isDeleted": false
                }
            )//search the class routine and return it
            if(findRoutine){
                res.json({
                    message: "Routine found",
                    findRoutine
                })
            }else{
                res.status(404).json({
                    message: "class Routine not found"
                })
            }
        }else{
            res.status(404).json({
                message: "Student not found"
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

//take the attendance record
const attendanceRecordController = async (req, res) => {
    try{
        const {className} = req.params //get the class name from params data
        const {classDate, record} = req.body //get the data from body input
        let trackingStudent = 0 //track that all student record has been accepted or not
        let absentEmail = [] //it is a empty array what store the absent student mail
        // console.log(record); //for debug purpose
        const isValidClass = await Class.findOne({className}) //is it a valid class or not just check it 
        if(isValidClass){ //if the class exist then it will execute
            for(let i = 0 ; i<= record.length - 1; i++ ){ //iterate all student attendance record input 
                const myData = record[i] //store the recordData into a variable
                // console.log(myData); //for debug purpose
                const findStudent = await Student.findOne({
                    "academicInfo.class": className, 
                    "userId": myData.studentId
                }) //find the student from database
                if(findStudent){
                    // console.log("Student found"); //for debug purpose
                    const student = findStudent //store the student into a variable
                    const {email} = student.personalInfo //get the email of the student we get
                    const {FirstName, LastName} = student.personalInfo.name
                    if(myData.attendanceStatus == true){ //if the user is attend then it will execute
                        const updateTheAttendanceRecord = await Student.updateOne(
                            {
                                "academicInfo.class": className, 
                                "userId": myData.studentId
                            }, //query part here  (query by student id and class)
                            {
                                $push: {
                                    "academicInfo.attendanceRecord.record": {
                                        "classDate": classDate,
                                        "status": myData.attendanceStatus //update the attendance status
                                    }
                                },
                                $inc: {
                                    "academicInfo.attendanceRecord.totalClass": 1, //total class increase one for each student
                                    "academicInfo.attendanceRecord.present": 1 //if the user present then increase one present in to the record
                                },

                            }, //update part
                            {} //option
                        ) //update data
                        if(updateTheAttendanceRecord.nModified !== 0){ //if the modification has done execute it
                            console.log("record Accepted");
                            trackingStudent++ //for tracking purpose so that we can confirm that all student's attendance is updated
                        }else{
                            console.log("record accept failed");
                        }
                    }else if ( myData.attendanceStatus == false ){ //if the student is absent then it will execute
                        const updateTheAttendanceRecord = await Student.updateOne(
                            {
                                "academicInfo.class": className, 
                                "userId": myData.studentId 
                            }, //query part here (query by student id and class)
                            {
                                $push: {
                                    "academicInfo.attendanceRecord.record": {
                                        "classDate": classDate,
                                        "status": myData.attendanceStatus //update the attendance status
                                    }
                                },
                                $inc: {
                                    "academicInfo.attendanceRecord.totalClass": 1, //total class increase one for each student
                                    "academicInfo.attendanceRecord.absent": 1 //if the user absent then increase one present in to the record
                                },

                            }, //update part
                            {} //option
                        ) //update data
                        if(updateTheAttendanceRecord.nModified !== 0){ //if the modification has done execute it
                            console.log("record Accepted");
                            trackingStudent++  //for tracking purpose so that we can confirm that all student's attendance is updated
                            // absentEmail.push(email)
                            // console.log(student);

                            //send the mail to the absent student part start
                            let transporter = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: Email, //get the data from dot env file
                                    pass: password //get the data from dot env file
                                }
                            }) //transporter part
                            
                            let mailOption = {
                                from: "moontahasidrat@gmail.com",
                                to: `${email}`,
                                subject: "Absent in the class",
                                text: `${FirstName} ${LastName} is absent on ${classDate}.`
                            } //mail option part

                            await transporter.sendMail(mailOption,(err, data) => { //email send part
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log(`Message has successfully send to ${FirstName} ${LastName}`);
                                }
                            })
                        }else{
                            console.log("record accept failed");
                        }
                    }else{
                        console.log("Update failed");
                    }

                }else{
                    // console.log("Student not found");  //for debug purpose
                    continue
                }
                
            }

            //check that all student's has been recorded successfully or not
            if(record.length == trackingStudent){ //if recorded successfully then execute it
                res.json({
                    message: "All student record has been saved"
                })
            }else{ 
                res.json({
                    message: "All student record can not be saved"
                })
            }

        }else{
            res.status(404).json({
                message: "Class not found"
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
    profileViewController,
    viewAllStudentByClass,
    individualStudentByIdController,
    viewSyllabusController,
    downloadSyllabusController,
    viewOwnClassRoutineController,
    attendanceRecordController
}