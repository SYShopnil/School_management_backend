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


const route = getExpress.Router()

route.post("/class/new/create", newCLassController)
route.post("/class/create/classRoutine", routineController)
route.post("/class/new/syllabus/create",fileUpload.single("syllabusFile"), creatSyllabusController)

route.put("/class/update/:className", updateClassController)
route.put("/class/delete/temp/:className", deleteClassController)

route.get("/class/view/:className", viewClassController)

//export part
module.exports = route