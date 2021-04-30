const studentValidation = require("../validation/student")

const preUpload = (req, res, next) => {
    const {error} = studentValidation.validate(req.body)
    if(error){
        next(
            res.json({
                message: "Validation error",
                error
            })
        )
    }else{
        next()
    }
}

module.exports = preUpload