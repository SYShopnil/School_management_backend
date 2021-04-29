const {loginController, updatePassword, forgotPassword, resetPassword, updateProfilePictureController} = require("../controller/user/user") //!!it should be changed
const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware  //!!it should be changed
const imgUpload = require("../../middleware/imageUpload") //image upload middleware  //!!it should be changed
const auth = require("../../middleware/authorization")  //!!it should be changed
const permission = require("../../middleware/permission")  //!!it should be changed

const route = getExpress.Router()

route.post("/login", loginController)
route.post("/update/password/:id", updatePassword)
route.post("/forgotPassword", forgotPassword)
route.post("/resetPassword", resetPassword)
route.post("/update/profilePicture", imgUpload.single("profilePicture") ,updateProfilePictureController)

//export part
module.exports = route