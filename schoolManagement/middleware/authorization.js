const jwt = require("jsonwebtoken")
const securityCode = process.env.SECURITY_CODE

const authMiddleware = (req, res, next) => {
    const userToken = req.header("Authorization") //get the token from header
    if(!userToken){
        res.status(401).json({
            message: "Unauthorized user"
        } )
    }
    const valid = jwt.verify(userToken, securityCode) //check is it originally our token or not
    if(valid){
        req.user = valid;
        next()
    }else{
        res.json({
            message:"Unauthorized user"
        })
    }
}

//export part
module.exports = authMiddleware