const { 
    newStudentCreatController, 
    updateStudentInfoController, 
    deleteStudentSingleController,
    studentActiveInactiveController,
    profileViewController } = require("../controller/user/student")
const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")
const preUpload = require("../../middleware/preUpload")

const route = getExpress.Router();

route.post("/create/newStudent",imgUpload.single("profileImage"), newStudentCreatController)

route.put("/update/info/:id", updateStudentInfoController)
route.put("/delete/temporary/:id", deleteStudentSingleController)
route.put("/change/activeInactive/:id", studentActiveInactiveController)


route.get("/profile/view/:id", profileViewController)



//export part 
module.exports = route