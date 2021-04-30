const { teacherRegistrationController, 
        updateTeacherInfoController,
        deleteTeacherTempController, 
        studentActiveInactiveController} = require("../controller/user/teacher")

const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")

const route = getExpress.Router();

route.post("/create/newTeacher",imgUpload.single("profileImage"), teacherRegistrationController)

route.put("/update/info/:id", updateTeacherInfoController)
route.put("/delete/temp/:id", deleteTeacherTempController)
route.put("/change/activeInactive/:id", studentActiveInactiveController)

//export part 
module.exports = route