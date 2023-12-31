const express = require('express')
const router = express.Router()
const{
    getCourses,
    createCourse,
    setCourseRating,
    editCourse
}=require('../controllers/courseController')
router.get('/',getCourses);
router.post('/:instructor',createCourse)
router.get('/getCourseRating',setCourseRating)
router.put('/editCourse/:courseId',editCourse)
module.exports=router