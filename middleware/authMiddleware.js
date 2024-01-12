const jwt=require("jsonwebtoken")
const HttpError=require("../models/errorModel")
const cookieParser = require('cookie-parser');

const authMiddleware=async(req,res,next)=>{
    const Authorization=req.headers.Authorization||req.headers.authorization;

    if(Authorization && Authorization.startsWith("Bearer")){

        const token=Authorization.split(' ')[1]
        jwt.verify(token,process.env.JWT_SECRECT,(err,info)=>{
            if(err){

                return next(new HttpError("Unauthorized. Invalid token."+err.message,403))
            }
            req.user=info;
            const role=req.user.role;
            next()
        })
    }
    else{
        return next(new HttpError("Unauthorized. no token ",401));
    }
}
const adminCheckMiddleware = (req, res, next) => {
    if (req.user.role === 'administrator') {
        next(); // Allow admin access
    } else {
        return next(new HttpError("Unauthorized. Admin access required."+req.user.role, 403));
    }
};
module.exports= {
    authMiddleware,
    adminCheckMiddleware
}