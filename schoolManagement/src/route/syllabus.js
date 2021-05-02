const { uploadSyllabusController, 
        downloadSyllabusController,
        updateSyllabusInfoController,
        viewSyllabusByClass} = require("../controller/academic/syllabus") //get the controller
const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")

const route = getExpress.Router()

route.post("/upload/update/syllabus/:className/:subject", auth,permission(["admin","teacher"]),fileUpload.single("syllabusFile"), uploadSyllabusController)

route.get("/download/syllabus/:className/:subject",auth,permission(["admin","teacher"]), downloadSyllabusController)
route.get("/view/syllabus/:className", auth,permission(["admin","teacher"]), viewSyllabusByClass)

route.put("/syllabus/update/info/:id", auth,permission(["admin","teacher"]), updateSyllabusInfoController)
//export part
module.exports = route