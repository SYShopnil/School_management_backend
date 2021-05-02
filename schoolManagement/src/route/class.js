const { newCLassController,
        routineController, 
        creatSyllabusController, 
        updateClassController, 
        deleteClassController,
        viewClassController} = require("../controller/academic/class")
const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")

//  fileUpload.single("syllabusFile"),
// ,auth,permission(["admin","teacher"])
const route = getExpress.Router()

route.post("/class/new/create", auth, permission(["admin"]),newCLassController)
route.post("/class/create/classRoutine", auth, permission(["admin"]), routineController)
route.post("/class/new/syllabus/create", auth, permission(["admin","teacher"]), creatSyllabusController)

route.put("/class/update/:className",auth,permission(["admin"]) ,updateClassController)
route.put("/class/delete/temp/:className",auth,permission(["admin"]), deleteClassController)

route.get("/class/view", auth, permission(["admin"]), viewClassController)

//export part
module.exports = route