const { teacherRegistrationController } = require("../controller/user/teacher")
const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")

const route = getExpress.Router();

route.post("/create/newTeacher",imgUpload.single("profileImage"), teacherRegistrationController)

//export part 
module.exports = route