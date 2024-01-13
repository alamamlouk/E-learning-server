const user = require('../models/userModel')
const HttpError=require("../models/errorModel")

const getUsers = async (req, res,next) => {
    const role=req.user.role
    try{
        if(role==="administrator"){
            const users=await user.find({})
            res.status(200).json({users})
        }
    }catch (error){
        return next(new  HttpError("couldn't get Users : "+ error.message,422))
    }
}
//update User
//Delete User
//Get All Users

module.exports = {
    getUsers,
}