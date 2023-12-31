
const HttpError=require("../models/errorModel")
const user=require("../models/userModel")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const registerUser=async (req,res,next)=>{
    try{
        const{
            email,
            username,
            password,
            verifyPassword,
        }=req.body;
        if(!username||!email||!password||!verifyPassword){
            return next(new HttpError("fill in all the fields",422))
        }
        const newEmail=email.toLowerCase()
        const emailExists=await user.findOne({email:newEmail})
        const usernameExist=await  user.findOne({username:username})
        if(emailExists){
            return  next(new HttpError("Email already exists",422))
        }
        if(usernameExist){
            return  next(new HttpError("username already exist",422))
        }

        if((password.trim()).length<6)
        {
            return  next(new  HttpError("Password should be at least 6 charachters",422))

        }
        if(password !== verifyPassword){
            return next(new HttpError("Passwords do not match"),422)

        }
         const newUser=await user.create(
    req.body
         )
        res.status(201).json(newUser)
        console.log(newUser)
    }catch (error){
        return  next(new HttpError("User registration failed : "+error.message,422))

    }
}

const loginUser=async (req,res,next)=>{
    try{
        const {email,password}=req.body
        if(!email||!password){
            return next(new HttpError("fill in all fields",422))
        }
        const newEmail=email.toLowerCase();
        const findUser=await user.findOne({
            email:newEmail
        })
        if(!findUser){
            return  next(new HttpError("Invalid credentials",422))
        }
        const comparePass=await bcrypt.compare(password,findUser.password)
        if(!comparePass){
            return  next(new HttpError("Invalid credentials",422))
        }
        const{_id:id,username,role}=findUser;
        const token=jwt.sign({id,username,role},process.env.JWT_SECRECT,{expiresIn: "1d"})
        res.cookie("jwt",token,{
            httpOnly:true,
            secure:true,
            maxAge:24*60*60*1000
        })
        res.status(200).json({token,id,username,role})
    }catch (error){
        return next(new HttpError("Login failed . please check your credentials."+error.message,422))
    }
}
const logOut=(req,res)=>{
    const token=req.headers.authorization;
    if(token){
        res.clearCookie('jwt')
        res.json({message:'You have logged out'})
    }
    else
    {
        res.status(401).json({message:"Not logged out "})
    }
}
module.exports={
    registerUser,
    loginUser,
    logOut
}
