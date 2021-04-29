const multer = require("multer")

//file filter part
const fileFilter = (req, file, cb) => {
    const getExtention = file.mimetype.split("/")
    const myExtention = getExtention[getExtention.length - 1]
    if(myExtention == "pdf" || myExtention == "docx" || myExtention == "doc"){
         cb(null, true)
    }else{
        cb(new Error("only pdf,docx and doc files are allowed"))
    }
}
const uploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./documents/file/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" +  file.originalname)
    }
})

const uploadFile = multer({
    storage: uploadStorage,
    limits: {
        fileSize: 2000000 //max 2mb allowed
    },
    fileFilter
})

//export part 
module.exports = uploadFile
