const jwt_decode = require("jwt-decode");//get the decode of jwt


const permissionMiddleware = (type) => {
    const inputUserType = type
    return (req, res, next) => {
        const myToken = req.header("Authorization");//get the token from header
        const decoded = jwt_decode(myToken) //decoder the token 
        const tokenUserType = decoded.userType; //get the token userType
        const isAvailable = inputUserType.includes(tokenUserType)//check that is the token user type is match to the input user type
        if(isAvailable){
            next() //if the input's token is match with route access token then next will run
        }else{
            res.json({
                message: "Restricted Route"
            })
        }
    }   
}

//export part
module.exports = permissionMiddleware