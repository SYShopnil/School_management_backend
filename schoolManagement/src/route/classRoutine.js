const {updateClassRoutineController,
        deleteClassRoutineController,
        showClassRoutineController} = require("../controller/academic/classRoutine")
const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")

const route = getExpress.Router()

route.put("/classRoutine/update/:className",auth,permission(["admin"]),  updateClassRoutineController)
route.put("/classRoutine/delete/:className", auth,permission(["admin"]), deleteClassRoutineController)


route.get("/classRoutine/show/:className",auth,permission(["admin"]), showClassRoutineController)


//export part
module.exports = route