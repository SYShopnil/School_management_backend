const { newStudentCreatController } = require("../controller/user/student")
const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")

const route = getExpress.Router();

route.post("/create/newStudent",imgUpload.single("profileImage"), newStudentCreatController)

//export part 
module.exports = route