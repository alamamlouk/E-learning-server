const express = require('express')
const router = express.Router()
const{
    getCourses,
    createCourse,
    setCourseRating,
    editCourse,
    testFile,
    getCoursesByInstructor,
    addLessons,
    getCourseById
}=require('../controllers/courseController')
const authMiddleware=require("../middleware/authMiddleware")

router.get('/',getCourses);
router.post('/createCourse',authMiddleware.authMiddleware,createCourse)
router.get('/getCourseRating',setCourseRating)
router.put('/editCourse/:courseId',authMiddleware.authMiddleware,editCourse)
router.post('/testUploadFile',testFile)
router.get('/getInstructorCourses',authMiddleware.authMiddleware,getCoursesByInstructor)
router.put('/addLessons/:courseId',authMiddleware.authMiddleware,addLessons)
router.get('/getCourse/:courseId',authMiddleware.authMiddleware,getCourseById)
module.exports=router