const { date } = require("joi")
const multer = require("multer")


//file filter part
const fileFilter = (req, file, cb) => {
    const getExtention = file.mimetype.split("/")
    const myExtention = getExtention[getExtention.length - 1]
    if(myExtention == "jpeg" || myExtention == "jpg" || myExtention == "png"){
         cb(null, true)
    }else{
        cb(new Error("only jpeg and jpg are allowed"))
    }
}
const uploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./documents/image/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" +  file.originalname)
    }
})

const uploadImage = multer({
    storage: uploadStorage,
    // limits: {
    //     fileSize: 5000000 //max 5 mb allowed
    // },
    fileFilter
})

//export part 
module.exports = uploadImage
