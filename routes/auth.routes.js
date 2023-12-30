const express = require('express')
const router = express.Router()
const {
    registerUser,
    loginUser,
    logOut
}=require('../controllers/auth.controller')
const protect=require("../middleware/protect")
const authMiddleware=require("../middleware/authMiddleware")
router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/logOut",authMiddleware.authMiddleware,logOut)
module.exports=router