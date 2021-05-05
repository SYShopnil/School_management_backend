const {questionSetController ,
        studentGetQuestionController,
        teacherAdminGetQestionController,
        resultSubmissionController} = require("../controller/academic/mcqQuestion")
const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")
const preUpload = require("../../middleware/preUpload")


const route = getExpress.Router()

route.post("/question/create", questionSetController )
route.post("/answer/submission/:subject", resultSubmissionController)

route.get("/show/question/:subject", studentGetQuestionController)
route.get("/show/question/:className/:subject", teacherAdminGetQestionController)


//export part
module.exports = route