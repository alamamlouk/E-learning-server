const express = require('express')
const router = express.Router()
const{
    enrollInCourse,
    getAll,
    rateCourse,
    setQcmScore
}=require('../controllers/userCoursControllere')
const authMiddleware=require("../middleware/authMiddleware")
router.post('/',authMiddleware.authMiddleware,enrollInCourse)
router.get('/',authMiddleware.authMiddleware,getAll)
router.put('/:rate',authMiddleware.authMiddleware,rateCourse)
router.put('/qcmScore/:score',authMiddleware.authMiddleware,setQcmScore)
module.exports=router