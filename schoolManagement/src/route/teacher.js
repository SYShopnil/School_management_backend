const { teacherRegistrationController, 
        updateTeacherInfoController,
        deleteTeacherTempController, 
        teacherActiveInactiveController,
        showAllTeacherController,
        findIndividualTeacherController} = require("../controller/user/teacher")

const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")

const route = getExpress.Router();

route.post("/create/newTeacher",auth,permission(["admin"]),imgUpload.single("profileImage"), teacherRegistrationController)

route.put("/update/info/:id", auth,permission(["admin"]),updateTeacherInfoController)
route.put("/delete/temp/:id", auth,permission(["admin"]),deleteTeacherTempController)
route.put("/change/activeInactive/:id",auth,permission(["admin"]), teacherActiveInactiveController)

route.get("/show/all",auth,permission(["admin","teacher","student"]), showAllTeacherController) 
route.get("/show/:id",auth,permission(["admin","teacher","student"]), findIndividualTeacherController) 

//export part 
module.exports = route