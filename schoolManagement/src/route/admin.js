const { registrationController } = require("../controller/user/admin")
const getExpress = require("express")
const fileUpload = require("../../middleware/fileUpload") //file upload middleware
const imgUpload = require("../../middleware/imageUpload") //image upload middleware
const auth = require("../../middleware/authorization")
const permission = require("../../middleware/permission")

const route = getExpress.Router()

route.post("/register",imgUpload.single("proImg") ,registrationController)
route.post("/upload", auth,permission(["admin","teacher","student"]), imgUpload.single("img"), (req, res) => {
    console.log(req.file);
}) //fake route for test the upload process

//export part
module.exports = route