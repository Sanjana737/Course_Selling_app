const jwt = require("jsonwebtoken")
const { JWT_USER_PASS } = require("../config")
function userMiddlewear(req,res, next){
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_USER_PASS);
    if(decoded){
        req.userId = decoded.id;
        next();
    }
    else{
        res.status(401).json({
            message: "ayou are not signed in"
        })
    }
}

module.exports = {
    userMiddlewear: userMiddlewear
}