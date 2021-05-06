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
const examDetailsValidation = require("../../../validation/examDetailsValidation")

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
        const {studentAnswer,examType} = req.body
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
                ) //check the answer is it available or not
                if(!isAnswerAvailable){
                    const newAnswer = new ResultSubmission({
                    studentId,
                    className,
                    subject,
                    studentAnswer,
                    examType
                }) 
                const saveAnswer = await newAnswer.save() //save the new answer
                    if(saveAnswer){
                        const {subject} = req.params //get the data from params
                        const token = req.header("Authorization") //get the token from header
                        const tokenData = jwtDecode(token) //decode the token data
                        const {id} = tokenData //get the data from token and store the id here
                        const findTheStudent = await Student.findOne({_id: id, "academicInfo.isActive": true, "academicInfo.isDeleted": false}) //get the student 
                        if(findTheStudent){
                            const student = findTheStudent //store the student data here
                            const {class:className} = student.academicInfo //get the class name of that student
                            const {FirstName, LastName} =student.personalInfo.name //get the full name of that student
                            const {userId} = student //get the student id from database
                            const {_id} = student
                            const isResponseAvailable = await ResultSubmission.findOne(
                                {
                                    studentId: userId ,
                                    className,
                                    subject
                                }
                            ) //check that is there have any response available or not
                            if(isResponseAvailable){ //if response found
                                const studentResponse = isResponseAvailable //store the response here
                                const {examType} = studentResponse //get the exam type from student response
                                const getTheQuestion  = await Question.findOne(
                                    {
                                        className,
                                        subject:  subject,
                                        examType
                                    }
                                ).select("questionSet.questionNo questionSet.originalAnswer questionSet.marks ")//find the question and get some specific value from data base

                                if(getTheQuestion){
                                    const question = getTheQuestion //store the question
                                    // console.log("question = ",question );
                                    // console.log("studentResponse = ",studentResponse );
                                    let myMark = 0
                                    let rightAnswer = 0
                                    let wrongAnswer = 0
                                    let totalMark = 0

                                    //result generate part start
                                    question.questionSet.map(questionElement => {
                                        totalMark += questionElement.marks //get the total mark
                                        studentResponse.studentAnswer.map(answerElement => {
                                            if(questionElement.questionNo == answerElement.questionNo ){
                                                if(questionElement.originalAnswer == answerElement.answer ){
                                                    myMark += questionElement.marks //store the mark
                                                    rightAnswer++ //if it's right then increment one
                                                }else{
                                                    wrongAnswer ++ //if it's wrong then increment one 
                                                }
                                            }
                                        }) //map the student response

                                    }) //map the question and find the main result with how many wrong answer and right answer there have with the total mark

                                    //get the result here user for debugging purpose
                                    // console.log("totalMark: ", totalMark);
                                    // console.log("myMark: ", myMark);
                                    // console.log("rightAnswer: ", rightAnswer);
                                    // console.log("wrongAnswer: ", wrongAnswer);
                                    // console.log("examType: ", examType);
                                    // console.log("subject: ", subject);
                                    // console.log("totalMarks: ", totalMark);
                                    // console.log(userId);
                                    // console.log(_id);
                                    const saveData = await Student.updateOne(
                                        {
                                            userId,
                                            "academicInfo.class":className,
                                            "academicInfo.isActive": true,
                                            "academicInfo.isDeleted": false,
                                            _id,
                                            "academicInfo.examDetails": {
                                                $elemMatch : {
                                                    examType: examType,
                                                    examSubject: subject,
                                                    totalMarks: totalMark
                                                } //query the data from data base
                                            }
                                        }, //query part
                                        {
                                            $set : {
                                                "academicInfo.examDetails.$.result.totalMark": totalMark,
                                                "academicInfo.examDetails.$.result.marks": myMark,
                                                "academicInfo.examDetails.$.result.rightAnswer": rightAnswer,
                                                "academicInfo.examDetails.$.result.wrongAnswer": wrongAnswer
                                            }
                                        }, //update part
                                        {} //option
                                    )
                                    // console.log(saveData);
                                    if(saveData.nModified !== 0){ //if the student result has been updated
                                        res.json({
                                            message: "result is processing to approve"
                                        })
                                    }else{
                                        res.json({
                                            message: "result update failed or already updated"
                                        })
                                    }
                                }else{
                                    res.status(404).json({
                                        message: "Question not found"
                                    })
                                }
                            }else{
                                res.status(404).json({
                                    message: "Response not available"
                                })
                            }
                        }else{
                            res.status(404).json({
                                message: "Student not found"
                            })
                        }



                        //store the response in the question schema
                        await Question.updateOne(
                            {
                                className,
                                subject
                            }, //query part
                            {
                                $inc: {
                                    response: 1
                                }
                            }, //update part
                            {} //option
                        )
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

//update the exam details part
const updateExamDetailsController = async (req, res) => {
    try{
        const {error} = examDetailsValidation.validate(req.body) //validation part of exam details
        if(!error){
            const {className} = req.params //get the data from params
        const isValidClass = await Class.findOne({className}) //check that there have any class name or not
        if(isValidClass){   
            const updateExamDetails = await Student.updateMany(
                {
                    "academicInfo.class": className,
                    "academicInfo.isActive": true,
                    "academicInfo.isDeleted": false
                }, //query
                {
                    $push : {
                        "academicInfo.examDetails": req.body
                    }
                }, //update part
                {multi: true}
            ) //check and update the data
            if(updateExamDetails){
                res.status(202).json({
                    message: `Exam details has been successfully updated of ${className} `
                })
            }else{
                res.status(400).json({
                    message: "Exam Update detaisl failed"
                })
            }
            }else{
                res.status.json({
                    message: "Class not found"
                })
            }
        }else{
            res.json({
                message: "Exam Details validation error",
                error
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

//approve result for all student by class subject and exam name
const approveResultController = async(req, res) => {
    try{
        const {className, subject, examType } = req.params //get the data from params
        const findClass = await Class.findOne({className}) //find the class 
        if(findClass){
            const approveResult = await Student.updateMany(
                {
                    "academicInfo.class": className,
                    "academicInfo.examDetails": {
                        $elemMatch : {
                            examType,
                            examSubject: subject
                        }
                    }
                }, //query
                {
                    $set : {
                        "academicInfo.examDetails.$.result.isPublished": true
                    }
                }, //update
                {multi: true} //option
            ) //update and give the approval
            if(approveResult.nModified !== 0){
                res.json({
                    message: `class ${className}'s ${subject} result of ${examType} has been approved `
                }) //approve message
            }else{
                res.json({
                    message: "approval failed"
                })
            }
        }else{
            res.json({
                message: "Class Not found"
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


//get the result for student
const viewResultController = async (req, res) => {
    try{
        const {subject, examType} = req.params //get the data from params
        const token = req.header("Authorization") //get the token from header
        const tokenData = jwtDecode(token) //decode the token data
        const {id} = tokenData //get the data from token and store the id here
        const findTheResult = await Student.findOne(
            {
                _id: id,
                "academicInfo.examDetails": {
                    $elemMatch : {
                        examType,
                        examSubject: subject,
                        "result.isPublished": true
                    }
                }
            } //query part 

        ).select(`academicInfo.examDetails.result.totalMark 
                    academicInfo.examDetails.result.marks
                    academicInfo.examDetails.result.rightAnswer
                    academicInfo.examDetails.result.wrongAnswer`) //get the result with some filtering

        if(findTheResult){    //if the result has been found then send the result
            res.json({
                message: "Result found",
                findTheResult
            })
        }else{  //else show that result is not available
            res.json({
                message: "Result is not ready yet or not approved by teacher"
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
    resultSubmissionController,
    updateExamDetailsController,
    viewResultController,
    approveResultController
}

