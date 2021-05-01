const { 
    newStudentCreatController, 
    updateStudentInfoController, 
    deleteStudentSingleController,
    studentActiveInactiveController,
    profileViewController,
    viewAllStudentByClass,
    individualStudentByIdController,
    viewSyllabusController,
    downloadSyllabusController,
    viewOwnClassRoutineController} = require("../controller/user/student")
const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")
const preUpload = require("../../middleware/preUpload")

const route = getExpress.Router();


route.post("/create/newStudent",auth,permission(["admin"]),imgUpload.single("profileImage"), newStudentCreatController)
route.post("/view/syllabus",auth,permission(["student"]), viewSyllabusController) //!!problem related to user route problem


route.put("/update/info/:id",auth,permission(["admin"]),updateStudentInfoController)
route.put("/delete/temporary/:id", auth,permission(["admin"]), deleteStudentSingleController)
route.put("/change/activeInactive/:id",auth,permission(["admin"]), studentActiveInactiveController)


route.get("/profile/view/:id",auth,permission(["admin"]), profileViewController)
route.get("/view/all/:className", auth,permission(["admin","teacher"]),  viewAllStudentByClass)
route.get("/view/:id", auth,permission(["admin","teacher"]),  individualStudentByIdController)
route.get("/syllabus/download",auth,permission(["student"]),  downloadSyllabusController) //!!i need to see the controller 
route.get("/show/classRoutine", auth,permission(["student"]), viewOwnClassRoutineController)





//export part 
module.exports = route