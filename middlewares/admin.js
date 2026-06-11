const jwt = require("jsonwebtoken")
const { JWT_ADMIN_PASS } = require("../config")
function adminMiddlewear(req,res, next){
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_ADMIN_PASS);
    if(decoded){
        req.adminId = decoded.id;
        next();
    }
    else{
        res.status(401).json({
            message: "ayou are not signed in"
        })
    }
}

module.exports = {
    adminMiddlewear: adminMiddlewear
}