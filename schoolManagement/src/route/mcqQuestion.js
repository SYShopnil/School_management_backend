const {questionSetController ,
        studentGetQuestionController,
        teacherAdminGetQestionController,
        resultSubmissionController,
        updateExamDetailsController,
        viewResultController,
        approveResultController,
        seeResultByIdController,
        seeAllResultByClassController} = require("../controller/academic/mcqQuestion")
const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")
const preUpload = require("../../middleware/preUpload")


const route = getExpress.Router()

route.post("/question/create",auth, permission(["teacher"]), questionSetController )
route.post("/answer/submission/:subject",auth, permission(["student"]), resultSubmissionController)

route.get("/show/question/:subject",auth, permission(["student"]), studentGetQuestionController)
route.get("/show/question/:className/:subject",auth, permission(["teacher", "admin"]),teacherAdminGetQestionController)
route.get("/show/result/:examType/:subject",auth, permission(["student"]), viewResultController) //view result by student profile
route.get("/show/individual/result/:id/:subject/:examType",auth, permission(["teacher", "admin"]), seeResultByIdController)
route.get("/show/all/result/:className/:subject/:examType",auth, permission(["teacher", "admin"]), seeAllResultByClassController)

route.put("/update/exam/details/:className",auth, permission(["teacher", "admin"]), updateExamDetailsController) //update the exam details means set the exam date by class
route.put("/result/approve/all/:examType/:subject/:className",auth, permission(["teacher", "admin"]), approveResultController) //if  result is ready then just approve it


//export part
module.exports = route