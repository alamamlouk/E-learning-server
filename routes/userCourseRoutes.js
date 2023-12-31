const express = require('express')
const router = express.Router()
const{
    enrollInCourse,
    getAll,
    rateCourse,
    setQcmScore
}=require('../controllers/userCoursControllere')
router.post('/',enrollInCourse)
router.get('/',getAll)
router.put('/:rate',rateCourse)
router.put('/qcmScore/:score',setQcmScore)
module.exports=router