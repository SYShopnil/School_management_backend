const Question = require("../../model/academic/mcqQuestion") //get the question schema from model
const Student = require("../../model/user/student") //get the student schema from model
const Teacher = require("../../model/user/teacher") // get the teacher schema from model
const Class = require("../../model/academic/class")
const bcrypt = require("bcrypt")
const User = require("../../model/user/user")
const ClassRoutine = require("../../model/academic/classRoutine")
const Syllabus = require("../../model/academic/syllabus")
const jwtDecode = require("jwt-decode")
const Admin = require("../../model/user/admin")
const ResultSubmission = require("../../model/academic/resultSubmission")


//question set up controller
const questionSetController = async (req, res) => {
    try{
        const {className, subject} = req.body;
        //check is it a valid class or not
        const isVaildClass = await Class.findOne({className}) //check that is there have any class or not
        if(isVaildClass){
            //check that if there have any question of this class and subject with this name
            const isQuestionFound = await Question.findOne(
                {
                    className,
                    subject
                }
            )
            if(!isQuestionFound){
                const createNewQuestion = new Question(req.body)
                const saveNewQuestion = await createNewQuestion.save() //save the new one 
                if(saveNewQuestion){
                    res.status(202).json({
                        message: "New question has create successfully"
                    })
                }else{
                    res.json({
                        message: "New question does not create please try again later"
                    })
                }

            }else{
                res.status(404).json({
                    message: "another question exist with this class name and subject"
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

//get the question for student
const studentGetQuestionController = async (req, res) => {
    try{
        const token = req.header("Authorization") //get the token from header
        const {subject} = req.params //get the data from params
        const tokenData = jwtDecode(token) //decode the token data and store it in a variable
        const {userType, id} = tokenData
        if(userType == "student"){
            const findStudent = await Student.findOne({_id: id }) //check that is it a valid student or not
            if(findStudent){
                const student = findStudent //store the student 
                const {class:className} = student.academicInfo //get the class of the student
                const findQuestion = await Question.findOne(
                    {
                        className,
                        subject
                    }
                ).select("questionSet.questionNo questionSet.question questionSet.marks") //query the data and find the expected data from database
                if(findQuestion){
                    const questionData = findQuestion //store the question data into another variable
                    res.status(200).json({
                        message: `${subject} question found`,
                        questionData
                    })
                }else{
                    res.status(404).json({
                        message: "Question not found"
                    })
                }
            }else{
                res.json({
                    message: "student not found"
                })
            }
        }else{
            res.status(401).json({  
                message: "User is not permitted or not valid"
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

//get the question for teacher and admin
const teacherAdminGetQestionController = async (req, res) => {
    try{
        const token = req.header("Authorization") //get the token from header
        const {subject, className} = req.params //get the data from params
        const tokenData = jwtDecode(token) //decode the token data and store it in a variable
        const {userType, id} = tokenData
        if(userType == "teacher"){ //if the user is a teacher
            const findTeacher = await Teacher.findOne({_id: id }) //check that is it a valid teacher or not
            if(findTeacher){
                const teacher = findTeacher //store the teacher 
                // const {class:className} = teacher.academicInfo //get the class of the teacher
                const findQuestion = await Question.findOne(
                    {
                        className,
                        subject
                    }
                ).select("questionSet.questionNo questionSet.question questionSet.marks questionSet.originalAnswer") //query the data and find the expected data from database
                if(findQuestion){
                    const questionData = findQuestion //store the question data into another variable
                    res.status(200).json({
                        message: `Class ${className}'s ${subject} question found`,
                        questionData
                    })
                }else{
                    res.status(404).json({
                        message: "Question not found"
                    })
                }
            }else{
                res.json({
                    message: "student not found"
                })
            }
        }else if (userType == "admin") { //if the user is an admin
            const findAdmin = await Admin.findOne({_id: id }) //check that is it a valid admin or not
            if(findAdmin){
                const admin = findAdmin //store the admin 
                // const {class:className} = admin.academicInfo //get the class of the admin
                const findQuestion = await Question.findOne(
                    {
                        className,
                        subject
                    }
                ).select("questionSet.questionNo questionSet.question questionSet.marks questionSet.originalAnswer") //query the data and find the expected data from database
                if(findQuestion){
                    const questionData = findQuestion //store the question data into another variable
                    res.status(200).json({
                        message: `Class ${className}'s ${subject} question found`,
                        questionData
                    })
                }else{
                    res.status(404).json({
                        message: "Question not found"
                    })
                }
            }else{
                res.json({
                    message: "Admin not found"
                })
            }
        }else{
            res.status(404).json({
                message: "User type is not right"
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

//submit the result
const resultSubmissionController = async (req, res) => {
    try{
        const {studentAnswer} = req.body
        const {subject} = req.params //get the data from params
        const token = req.header("Authorization") //get the token from header
        const tokenData = jwtDecode(token) //decode the token data
        const {id} = tokenData
        const findStudent = await Student.findOne({_id: id, "academicInfo.isActive": true, "academicInfo.isDeleted": false}) //get the student 
        if(findStudent){ //find the student that is it a valid student or not
            const student = findStudent
            const {userId:studentId} = student
            const {class:className} = student.academicInfo
            const isQuestionAvailable = await Question.findOne(
                {
                    className,
                    subject
                }
            ) //check that questions is available or not
            if(isQuestionAvailable){ //if there have any any question or not in the database
                const isAnswerAvailable = await ResultSubmission.findOne(
                    {
                        className,
                        studentId,
                        subject
                    }
                ) //check is it available or not
                if(!isAnswerAvailable){
                    const newAnswer = new ResultSubmission({
                    studentId,
                    className,
                    subject,
                    studentAnswer
                }) 
                const saveAnswer = await newAnswer.save() //save the new answer
                    if(saveAnswer){
                        res.status(201).json({
                            message: "Response recorded succesfully",
                            saveAnswer
                        })
                    }else{
                        res.json({
                            message: "answer submission failed"
                        })
                    }
                }else{
                    res.json({
                        message: "result has already submitted"
                    })
                }
                
            }else{
                res.status(404).json({
                    message: "Question not found"
                })
            }
        }else{
            res.status(404).json({
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

//export part
module.exports = {
    questionSetController,
    studentGetQuestionController,
    teacherAdminGetQestionController,
    resultSubmissionController
}

